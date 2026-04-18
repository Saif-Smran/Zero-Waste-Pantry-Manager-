import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

let csrfTokenCache = ''

export const setCsrfToken = (token) => {
  csrfTokenCache = typeof token === 'string' ? token : ''
}

export const getCsrfToken = () => {
  if (csrfTokenCache) {
    return csrfTokenCache
  }

  const match = document.cookie.match(/(?:^|; )csrftoken=([^;]+)/)
  const token = match ? decodeURIComponent(match[1]) : ''

  if (token) {
    csrfTokenCache = token
  }

  return token
}

let csrfBootstrapPromise = null

export const ensureCsrfCookie = async () => {
  if (getCsrfToken()) {
    return
  }

  if (!csrfBootstrapPromise) {
    csrfBootstrapPromise = axios
      .get(`${API_BASE_URL.replace(/\/$/, '')}/api/auth/csrf/`, {
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
  const method = (config.method || 'get').toLowerCase()
  const requiresCsrf = ['post', 'put', 'patch', 'delete'].includes(method)

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
      window.dispatchEvent(new CustomEvent('auth:expired'))
    }

    return Promise.reject(error)
  },
)

export const authApi = {
  session: () => api.get('/api/auth/session/'),
  login: (payload) => api.post('/api/auth/login/', payload),
  register: (payload) => api.post('/api/auth/register/', payload),
  logout: () => api.post('/api/auth/logout/'),
}

export default api
