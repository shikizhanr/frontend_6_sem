import { z } from 'zod'

export const emailSchema = z.string().trim().email('Введите корректный email')
export const passwordSchema = z.string().min(6, 'Пароль должен содержать минимум 6 символов')
export const todoTitleSchema = z.string().trim().min(1, 'Введите название задачи').max(120, 'Не более 120 символов')

export const loginSchema = z.object({ email: emailSchema, password: passwordSchema })
export const todoSchema = z.object({ title: todoTitleSchema })

export function validateEmail(value: string): true | string {
  const result = emailSchema.safeParse(value)
  return result.success || result.error.issues[0]?.message || 'Некорректный email'
}

export function validatePassword(value: string): true | string {
  const result = passwordSchema.safeParse(value)
  return result.success || result.error.issues[0]?.message || 'Некорректный пароль'
}

export function validateTodoTitle(value: string): true | string {
  const result = todoTitleSchema.safeParse(value)
  return result.success || result.error.issues[0]?.message || 'Некорректное название'
}

export async function isEmailUnique(email: string): Promise<true | string> {
  if (validateEmail(email) !== true) return 'Введите корректный email'
  const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/users?email=${encodeURIComponent(email)}`)
  if (!response.ok) return 'Не удалось проверить email'
  const users = (await response.json()) as Array<{ id: number }>
  return users.length === 0 || 'Этот email уже зарегистрирован'
}
