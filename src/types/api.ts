export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface LoginRequest { email: string; password: string }
export interface RegisterRequest extends LoginRequest { name: string }
export interface AuthTokens { accessToken: string; refreshToken: string }
export interface UserProfile { id: number; name: string; email: string }
export interface AuthResponse extends AuthTokens { user: UserProfile }
export interface UserSettings { theme: 'light' | 'dark'; compactMode: boolean }

export type AppError =
  | { kind: 'network'; message: string; retryable: true; cause?: Error }
  | { kind: 'validation'; message: string; retryable: false; fields: Record<string, string> }
  | { kind: 'business'; message: string; retryable: false; code: string }
  | { kind: 'unknown'; message: string; retryable: false; cause?: Error }
