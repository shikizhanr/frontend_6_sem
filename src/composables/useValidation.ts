import { computed, reactive, type ComputedRef, type UnwrapNestedRefs } from 'vue'
import type { ZodObject, ZodRawShape } from 'zod'

export interface ValidationState<T extends Record<string, string>> {
  values: UnwrapNestedRefs<T>
  errors: Record<keyof T, string>
  isValid: ComputedRef<boolean>
  validateField: (field: keyof T) => boolean
  validate: () => boolean
  reset: () => void
}

export function useValidation<T extends Record<string, string>, S extends ZodRawShape>(initial: T, schema: ZodObject<S>): ValidationState<T> {
  const values = reactive({ ...initial }) as UnwrapNestedRefs<T>
  const errors = reactive({}) as Record<keyof T, string>
  const isValid = computed(() => schema.safeParse(values).success)
  function validateField(field: keyof T): boolean {
    const result = schema.safeParse(values)
    if (result.success) { errors[field] = ''; return true }
    const issue = result.error.issues.find((item) => item.path[0] === field)
    errors[field] = issue?.message ?? ''
    return !issue
  }
  function validate(): boolean {
    const result = schema.safeParse(values)
    Object.keys(values).forEach((field) => { errors[field as keyof T] = '' })
    if (result.success) return true
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof T
      if (field in values && !errors[field]) errors[field] = issue.message
    })
    return false
  }
  function reset(): void { Object.assign(values, initial); Object.keys(values).forEach((field) => { errors[field as keyof T] = '' }) }
  return { values, errors, isValid, validateField, validate, reset }
}
