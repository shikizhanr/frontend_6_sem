import { apiClient } from './apiClient'
import { todoTitleSchema } from '../utils/validation'
import type { CreateTodoInput, ITodoItem, UpdateTodoInput } from '../types'

const cache = new Map<string, { expires: number; data: ITodoItem[] }>()

export const todoService = {
  async getAll(force = false): Promise<ITodoItem[]> {
    const cached = cache.get('todos')
    if (!force && cached && cached.expires > Date.now()) return cached.data
    const { data } = await apiClient.get<ITodoItem[]>('/todos', { params: { _sort: 'createdAt', _order: 'desc' } })
    cache.set('todos', { expires: Date.now() + 30_000, data })
    return data
  },
  async create(input: CreateTodoInput): Promise<ITodoItem> {
    const title = todoTitleSchema.parse(input.title)
    const todo: Omit<ITodoItem, 'id'> = { title, completed: false, createdAt: new Date().toISOString(), userId: input.userId ?? 1, tagIds: input.tagIds ?? [] }
    const { data } = await apiClient.post<ITodoItem>('/todos', todo)
    cache.delete('todos')
    return data
  },
  async update(id: number, input: UpdateTodoInput): Promise<ITodoItem> {
    const payload = input.title === undefined ? input : { ...input, title: todoTitleSchema.parse(input.title) }
    const { data } = await apiClient.patch<ITodoItem>(`/todos/${id}`, payload)
    cache.delete('todos')
    return data
  },
  async remove(id: number): Promise<void> { await apiClient.delete(`/todos/${id}`); cache.delete('todos') }
}
