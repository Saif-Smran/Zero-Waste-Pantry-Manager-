import axios from 'axios'

export const getCsrfToken = () => {
  const match = document.cookie.match(/(?:^|; )csrftoken=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : ''
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'X-CSRFToken': getCsrfToken(),
  },
})

export default api
