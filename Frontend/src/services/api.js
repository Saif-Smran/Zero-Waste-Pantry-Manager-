import axios from 'axios'

const explicitApiBaseUrl = String(import.meta.env.VITE_API_URL || '').trim()
const API_BASE_URL = explicitApiBaseUrl ? explicitApiBaseUrl.replace(/\/$/, '') : ''

class AuthExpiredError extends Error {
  constructor(message = 'Your session has expired. Please log in again.', cause = null) {
    super(message)
    this.name = 'AuthExpiredError'
    this.isAuthExpired = true
    this.cause = cause
  }
}

export const isAuthExpiredError = (error) => Boolean(error?.isAuthExpired)

let csrfTokenCache = ''

const readCsrfTokenFromCookie = () => {
  if (typeof document === 'undefined') {
    return ''
  }

  const match = document.cookie.match(/(?:^|; )csrftoken=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : ''
}

export const setCsrfToken = (token) => {
  csrfTokenCache = typeof token === 'string' ? token : ''
}

export const clearCsrfToken = () => {
  csrfTokenCache = ''
}

export const getCsrfToken = () => {
  const cookieToken = readCsrfTokenFromCookie()

  if (cookieToken) {
    csrfTokenCache = cookieToken
    return cookieToken
  }

  return csrfTokenCache
}

let csrfBootstrapPromise = null

export const ensureCsrfCookie = async () => {
  if (getCsrfToken()) {
    return
  }

  if (!csrfBootstrapPromise) {
    const csrfEndpoint = API_BASE_URL
      ? `${API_BASE_URL.replace(/\/$/, '')}/api/auth/csrf/`
      : '/api/auth/csrf/'

    csrfBootstrapPromise = axios
      .get(csrfEndpoint, {
        withCredentials: true,
      })
      .finally(() => {
        csrfBootstrapPromise = null
      })
  }

  await csrfBootstrapPromise

  const token = getCsrfToken()
  if (token) {
    csrfTokenCache = token
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

api.interceptors.request.use(async (config) => {
  config.withCredentials = true

  const method = (config.method || 'get').toLowerCase()
  const requiresCsrf = ['post', 'put', 'patch', 'delete'].includes(method)

  if (requiresCsrf || method === 'get') {
    await ensureCsrfCookie()
  }

  const csrfToken = getCsrfToken()
  if (csrfToken) {
    config.headers = config.headers || {}
    config.headers['X-CSRFToken'] = csrfToken
  }

  return config
})

api.interceptors.response.use(
  (response) => {
    const cookieToken = readCsrfTokenFromCookie()
    if (cookieToken) {
      setCsrfToken(cookieToken)
      return response
    }

    const nextToken = response?.data?.csrf_token
    if (typeof nextToken === 'string' && nextToken) {
      setCsrfToken(nextToken)
    }

    return response
  },
  (error) => {
    const statusCode = error?.response?.status
    const requestUrl = String(error?.config?.url || '')
    const isAuthEndpoint = requestUrl.includes('/api/auth/')

    if ((statusCode === 401 || statusCode === 403) && !isAuthEndpoint && typeof window !== 'undefined') {
      clearCsrfToken()
      window.dispatchEvent(new CustomEvent('auth:expired'))
      return Promise.reject(new AuthExpiredError(undefined, error))
    }

    return Promise.reject(error)
  },
)

export const authApi = {
  session: () =>
    api.get('/api/auth/session/', {
      params: { _: Date.now() },
    }),
  login: (payload) => api.post('/api/auth/login/', payload),
  register: (payload) => api.post('/api/auth/register/', payload),
  logout: () => api.post('/api/auth/logout/'),
}

export default api
