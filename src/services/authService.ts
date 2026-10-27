import { apiClient, clearTokens, saveTokens } from './apiClient'
import type { AuthResponse, LoginRequest, RegisterRequest, UserProfile, UserSettings } from '../types'

const isStaticDemo = import.meta.env.VITE_API_URL === 'local'
const DEMO_USER: UserProfile = { id: 1, name: 'Демо пользователь', email: 'demo@example.com' }
const SETTINGS_KEY = 'todo-user-settings'

function staticAuthResponse(email: string): AuthResponse {
  const user = email === DEMO_USER.email ? DEMO_USER : { ...DEMO_USER, email }
  const response = { user, accessToken: 'static-demo-access', refreshToken: 'static-demo-refresh' }
  saveTokens(response.accessToken, response.refreshToken)
  return response
}

export const authService = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    if (isStaticDemo) return staticAuthResponse(payload.email)
    const { data } = await apiClient.post<AuthResponse>('/auth/login', payload)
    saveTokens(data.accessToken, data.refreshToken)
    return data
  },
  async register(payload: RegisterRequest): Promise<AuthResponse> {
    if (isStaticDemo) return staticAuthResponse(payload.email)
    const { data } = await apiClient.post<AuthResponse>('/auth/register', payload)
    saveTokens(data.accessToken, data.refreshToken)
    return data
  },
  async profile(): Promise<UserProfile> {
    if (isStaticDemo) return DEMO_USER
    return (await apiClient.get<UserProfile>('/profile')).data
  },
  async updateSettings(settings: UserSettings): Promise<UserSettings> {
    if (isStaticDemo) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
      return settings
    }
    return (await apiClient.patch<UserSettings>('/settings', settings)).data
  },
  logout(): void { clearTokens() }
}
