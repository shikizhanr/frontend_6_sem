import type { ZodType } from 'zod'

export function firstValidationError<T>(schema: ZodType<T>, value: unknown): string | null {
  const result = schema.safeParse(value)
  return result.success ? null : (result.error.issues[0]?.message ?? 'Проверьте введенные данные')
}

export function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}
