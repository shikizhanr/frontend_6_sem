import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

const ACCESS_KEY = 'todo-access-token'
const REFRESH_KEY = 'todo-refresh-token'

export const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', timeout: 7000 })

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(ACCESS_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshing: Promise<string> | null = null

apiClient.interceptors.response.use((response) => response, async (error: AxiosError) => {
  const request = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined
  if (error.response?.status !== 401 || !request || request._retry || request.url?.includes('/auth/')) throw error
  request._retry = true
  refreshing ??= axios.post<{ accessToken: string }>(`${apiClient.defaults.baseURL}/auth/refresh`, {
    refreshToken: localStorage.getItem(REFRESH_KEY)
  }).then(({ data }) => {
    localStorage.setItem(ACCESS_KEY, data.accessToken)
    return data.accessToken
  }).finally(() => { refreshing = null })
  request.headers.Authorization = `Bearer ${await refreshing}`
  return apiClient(request)
})

export function saveTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_KEY, accessToken)
  localStorage.setItem(REFRESH_KEY, refreshToken)
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

export function hasAccessToken(): boolean { return Boolean(localStorage.getItem(ACCESS_KEY)) }
