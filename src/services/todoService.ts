import { apiClient } from './apiClient'
import { todoTitleSchema } from '../utils/validation'
import type { CreateTodoInput, ITodoItem, UpdateTodoInput } from '../types'

const cache = new Map<string, { expires: number; data: ITodoItem[] }>()
const isStaticDemo = import.meta.env.VITE_API_URL === 'local'
const STORAGE_KEY = 'todo-items'
const DEFAULT_TODOS: ITodoItem[] = [
  { id: 1, title: 'Изучить компоненты Quasar', completed: true, createdAt: '2026-10-20T09:00:00.000Z', userId: 1, tagIds: [1] },
  { id: 2, title: 'Настроить Pinia store', completed: false, createdAt: '2026-10-21T12:30:00.000Z', userId: 1, tagIds: [2] },
  { id: 3, title: 'Написать компонентные тесты', completed: false, createdAt: '2026-10-22T15:15:00.000Z', userId: 1, tagIds: [1, 2] }
]

function readStaticTodos(): ITodoItem[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TODOS))
    return [...DEFAULT_TODOS]
  }
  try { return JSON.parse(stored) as ITodoItem[] } catch { return [...DEFAULT_TODOS] }
}

function writeStaticTodos(todos: ITodoItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

export const todoService = {
  async getAll(force = false): Promise<ITodoItem[]> {
    if (isStaticDemo) return readStaticTodos()
    const cached = cache.get('todos')
    if (!force && cached && cached.expires > Date.now()) return cached.data
    const { data } = await apiClient.get<ITodoItem[]>('/todos', { params: { _sort: 'createdAt', _order: 'desc' } })
    cache.set('todos', { expires: Date.now() + 30_000, data })
    return data
  },
  async create(input: CreateTodoInput): Promise<ITodoItem> {
    const title = todoTitleSchema.parse(input.title)
    const todo: Omit<ITodoItem, 'id'> = { title, completed: false, createdAt: new Date().toISOString(), userId: input.userId ?? 1, tagIds: input.tagIds ?? [] }
    if (isStaticDemo) {
      const todos = readStaticTodos()
      const created = { ...todo, id: Math.max(0, ...todos.map((item) => item.id)) + 1 }
      writeStaticTodos([created, ...todos])
      return created
    }
    const { data } = await apiClient.post<ITodoItem>('/todos', todo)
    cache.delete('todos')
    return data
  },
  async update(id: number, input: UpdateTodoInput): Promise<ITodoItem> {
    const payload = input.title === undefined ? input : { ...input, title: todoTitleSchema.parse(input.title) }
    if (isStaticDemo) {
      const todos = readStaticTodos()
      const index = todos.findIndex((item) => item.id === id)
      const current = todos[index]
      if (!current) throw new Error('Задача не найдена')
      const updated = { ...current, ...payload }
      todos[index] = updated
      writeStaticTodos(todos)
      return updated
    }
    const { data } = await apiClient.patch<ITodoItem>(`/todos/${id}`, payload)
    cache.delete('todos')
    return data
  },
  async remove(id: number): Promise<void> {
    if (isStaticDemo) { writeStaticTodos(readStaticTodos().filter((item) => item.id !== id)); return }
    await apiClient.delete(`/todos/${id}`)
    cache.delete('todos')
  }
}
