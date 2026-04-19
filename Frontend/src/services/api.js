import axios from 'axios'

const explicitApiBaseUrl = String(import.meta.env.VITE_API_URL || '').trim()
const isNetlifyHosted =
  typeof window !== 'undefined' &&
  /\.netlify\.app$/i.test(window.location.hostname)
const API_BASE_URL = isNetlifyHosted
  ? ''
  : explicitApiBaseUrl
    ? explicitApiBaseUrl.replace(/\/$/, '')
    : ''

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

const getCsrfTokenFromResponse = (response) => {
  const nextToken = response?.data?.csrf_token
  if (typeof nextToken === 'string' && nextToken) {
    return nextToken
  }

  return ''
}

const isMutatingMethod = (method) => ['post', 'put', 'patch', 'delete'].includes(String(method || 'get').toLowerCase())

let csrfBootstrapPromise = null

export const ensureCsrfCookie = async ({ force = false } = {}) => {
  if (!force) {
    const existingToken = getCsrfToken()
    if (existingToken) {
      return existingToken
    }
  }

  if (!csrfBootstrapPromise || force) {
    const csrfEndpoint = API_BASE_URL
      ? `${API_BASE_URL.replace(/\/$/, '')}/api/auth/csrf/`
      : '/api/auth/csrf/'

    csrfBootstrapPromise = axios
      .get(csrfEndpoint, {
        withCredentials: true,
      })
      .then((response) => {
        const tokenFromResponse = getCsrfTokenFromResponse(response)
        const tokenFromCookie = readCsrfTokenFromCookie()
        const nextToken = tokenFromResponse || tokenFromCookie

        if (nextToken) {
          setCsrfToken(nextToken)
        }

        return nextToken
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

  return csrfTokenCache
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

api.interceptors.request.use(async (config) => {
  config.withCredentials = true

  const method = (config.method || 'get').toLowerCase()
  const requiresCsrf = isMutatingMethod(method)

  if (requiresCsrf) {
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
    const tokenFromResponse = getCsrfTokenFromResponse(response)
    const tokenFromCookie = readCsrfTokenFromCookie()
    const nextToken = tokenFromResponse || tokenFromCookie

    if (nextToken) {
      setCsrfToken(nextToken)
    }

    return response
  },
  async (error) => {
    const statusCode = error?.response?.status
    const requestConfig = error?.config || {}
    const requestUrl = String(requestConfig.url || '')
    const requestMethod = (requestConfig.method || 'get').toLowerCase()
    const isAuthEndpoint = requestUrl.includes('/api/auth/')
    const responseMessage = String(
      error?.response?.data?.detail || error?.response?.data?.error || ''
    ).toLowerCase()
    const isCsrfFailure = statusCode === 403 && responseMessage.includes('csrf')

    if (isCsrfFailure && isMutatingMethod(requestMethod) && !requestConfig._csrfRetry) {
      requestConfig._csrfRetry = true
      await ensureCsrfCookie({ force: true })

      const csrfToken = getCsrfToken()
      if (csrfToken) {
        requestConfig.headers = requestConfig.headers || {}
        requestConfig.headers['X-CSRFToken'] = csrfToken
      }

      return api.request(requestConfig)
    }

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
