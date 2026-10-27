import { apiClient, clearTokens, saveTokens } from './apiClient'
import type { AuthResponse, LoginRequest, RegisterRequest, UserProfile, UserSettings } from '../types'

export const authService = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', payload)
    saveTokens(data.accessToken, data.refreshToken)
    return data
  },
  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', payload)
    saveTokens(data.accessToken, data.refreshToken)
    return data
  },
  async profile(): Promise<UserProfile> { return (await apiClient.get<UserProfile>('/profile')).data },
  async updateSettings(settings: UserSettings): Promise<UserSettings> {
    return (await apiClient.patch<UserSettings>('/settings', settings)).data
  },
  logout(): void { clearTokens() }
}
