import axios from 'axios'
import type { App } from 'vue'
import type { AppError } from '../types'

export function classifyError(error: unknown): AppError {
  if (axios.isAxiosError(error)) {
    if (!error.response) return { kind: 'network', message: 'Нет соединения с сервером', retryable: true, cause: error }
    if (error.response.status === 400 || error.response.status === 422) {
      return { kind: 'validation', message: 'Проверьте введенные данные', retryable: false, fields: {} }
    }
    return { kind: 'business', message: String(error.response.data?.message || 'Операция не выполнена'), retryable: false, code: String(error.response.status) }
  }
  if (error instanceof Error) return { kind: 'unknown', message: 'Произошла непредвиденная ошибка', retryable: false, cause: error }
  return { kind: 'unknown', message: 'Произошла непредвиденная ошибка', retryable: false }
}

export function logError(error: AppError): void {
  if (import.meta.env.DEV) console.error(`[${error.kind}]`, error.message, 'cause' in error ? error.cause : '')
}

export function installGlobalErrorHandlers(app: App): void {
  app.config.errorHandler = (error): void => logError(classifyError(error))
  window.addEventListener('unhandledrejection', (event) => logError(classifyError(event.reason)))
  window.addEventListener('error', (event) => logError(classifyError(event.error)))
}

export async function withRetry<T>(operation: () => Promise<T>, attempts = 3, delayMs = 250): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try { return await operation() } catch (error) {
      lastError = error
      if (attempt < attempts - 1) await new Promise<void>((resolve) => window.setTimeout(resolve, delayMs * (attempt + 1)))
    }
  }
  throw lastError
}
