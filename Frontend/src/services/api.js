import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const getCsrfToken = () => {
  const match = document.cookie.match(/(?:^|; )csrftoken=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : ''
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

export const authApi = {
  session: () => api.get('/api/auth/session/'),
  login: (payload) => api.post('/api/auth/login/', payload),
  register: (payload) => api.post('/api/auth/register/', payload),
  logout: () => api.post('/api/auth/logout/'),
}

export default api
