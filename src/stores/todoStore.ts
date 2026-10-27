import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { todoService } from '../services/todoService'
import { classifyError } from '../utils/errorHandling'
import type { AppError, ITodoItem, TodoFilter } from '../types'

const STORAGE_KEY = 'todo-items'
function readStoredTodos(): ITodoItem[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as ITodoItem[] } catch { return [] }
}

export const useTodoStore = defineStore('todos', () => {
  const todos = ref<ITodoItem[]>(readStoredTodos())
  const filter = ref<TodoFilter>('all')
  const search = ref('')
  const isLoading = ref(false)
  const error = ref<AppError | null>(null)
  const filteredTodos = computed(() => {
    const query = search.value.trim().toLocaleLowerCase('ru')
    return todos.value.filter((todo) => {
      const visible = filter.value === 'all' || (filter.value === 'completed' ? todo.completed : !todo.completed)
      return visible && (!query || todo.title.toLocaleLowerCase('ru').includes(query))
    })
  })
  const activeCount = computed(() => todos.value.filter((todo) => !todo.completed).length)
  watch(todos, (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items)), { deep: true })

  async function run<T>(operation: () => Promise<T>): Promise<T> {
    isLoading.value = true; error.value = null
    try { return await operation() }
    catch (cause) { error.value = classifyError(cause); throw cause }
    finally { isLoading.value = false }
  }
  async function fetchTodos(force = false): Promise<void> { await run(async () => { todos.value = await todoService.getAll(force) }) }
  async function addTodo(title: string): Promise<void> { await run(async () => { todos.value.unshift(await todoService.create({ title })) }) }
  async function toggleTodo(id: number): Promise<void> {
    const todo = todos.value.find((item) => item.id === id)
    if (!todo) return
    await run(async () => { Object.assign(todo, await todoService.update(id, { completed: !todo.completed })) })
  }
  async function updateTitle(id: number, title: string): Promise<void> {
    const todo = todos.value.find((item) => item.id === id)
    if (todo) await run(async () => { Object.assign(todo, await todoService.update(id, { title })) })
  }
  async function deleteTodo(id: number): Promise<void> { await run(async () => { await todoService.remove(id); todos.value = todos.value.filter((item) => item.id !== id) }) }
  function setFilter(value: TodoFilter): void { filter.value = value }
  function setSearch(value: string): void { search.value = value }
  function clearError(): void { error.value = null }
  return { todos, filter, search, isLoading, error, filteredTodos, activeCount, fetchTodos, addTodo, toggleTodo, updateTitle, deleteTodo, setFilter, setSearch, clearError }
})
