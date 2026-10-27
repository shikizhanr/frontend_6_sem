import { Notify } from 'quasar'
import { classifyError, logError } from '../utils/errorHandling'
import type { AppError } from '../types'

export function useErrorHandler(): { handleError: (error: unknown) => AppError } {
  function handleError(error: unknown): AppError {
    const appError = classifyError(error)
    logError(appError)
    Notify.create({ type: 'negative', message: appError.message, icon: 'error_outline' })
    return appError
  }
  return { handleError }
}
