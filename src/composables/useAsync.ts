import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { classifyError } from '../utils/errorHandling'
import type { AppError } from '../types'

export interface AsyncState<T> {
  data: Ref<T | null>
  error: Ref<AppError | null>
  isLoading: Ref<boolean>
  hasError: ComputedRef<boolean>
  execute: (...args: unknown[]) => Promise<T | null>
}

export function useAsync<T>(operation: (...args: unknown[]) => Promise<T>): AsyncState<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<AppError | null>(null) as Ref<AppError | null>
  const isLoading = ref(false)
  const hasError = computed(() => error.value !== null)
  async function execute(...args: unknown[]): Promise<T | null> {
    isLoading.value = true
    error.value = null
    try { data.value = await operation(...args); return data.value }
    catch (cause) { error.value = classifyError(cause); return null }
    finally { isLoading.value = false }
  }
  return { data, error, isLoading, hasError, execute }
}
