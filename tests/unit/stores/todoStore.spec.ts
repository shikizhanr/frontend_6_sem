import { createPinia, setActivePinia } from 'pinia'
import { useTodoStore } from '../../../src/stores/todoStore'
import { todoService } from '../../../src/services/todoService'

vi.mock('../../../src/services/todoService', () => ({ todoService: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), remove: vi.fn() } }))

describe('todoStore', () => {
  beforeEach(() => { localStorage.clear(); setActivePinia(createPinia()); vi.clearAllMocks() })
  it('загружает задачи', async () => {
    vi.mocked(todoService.getAll).mockResolvedValue([{ id: 1, title: 'Тест', completed: false, createdAt: '2026-01-01', userId: 1, tagIds: [] }])
    const store = useTodoStore(); await store.fetchTodos()
    expect(store.todos).toHaveLength(1); expect(store.activeCount).toBe(1)
  })
  it('добавляет задачу', async () => {
    vi.mocked(todoService.create).mockResolvedValue({ id: 2, title: 'Новая', completed: false, createdAt: '2026-01-01', userId: 1, tagIds: [] })
    const store = useTodoStore(); await store.addTodo('Новая')
    expect(store.todos[0]?.title).toBe('Новая')
  })
  it('сохраняет ошибку сервиса', async () => {
    vi.mocked(todoService.getAll).mockRejectedValue(new Error('fail'))
    const store = useTodoStore(); await expect(store.fetchTodos()).rejects.toThrow('fail')
    expect(store.error?.kind).toBe('unknown')
    store.clearError(); expect(store.error).toBeNull()
  })
  it('фильтрует и ищет задачи', () => {
    localStorage.setItem('todo-items', JSON.stringify([
      { id: 1, title: 'Активная Vue', completed: false, createdAt: '2026-01-01', userId: 1, tagIds: [] },
      { id: 2, title: 'Готовая Quasar', completed: true, createdAt: '2026-01-01', userId: 1, tagIds: [] }
    ]))
    const store = useTodoStore(); store.todos = JSON.parse(localStorage.getItem('todo-items') || '[]')
    store.setFilter('completed'); expect(store.filteredTodos.map((item) => item.id)).toEqual([2])
    store.setFilter('all'); store.setSearch('vue'); expect(store.filteredTodos.map((item) => item.id)).toEqual([1])
  })
  it('изменяет, переименовывает и удаляет задачу', async () => {
    const item = { id: 1, title: 'Старая', completed: false, createdAt: '2026-01-01', userId: 1, tagIds: [] }
    vi.mocked(todoService.update)
      .mockResolvedValueOnce({ ...item, completed: true })
      .mockResolvedValueOnce({ ...item, title: 'Новая' })
    vi.mocked(todoService.remove).mockResolvedValue()
    const store = useTodoStore(); store.todos = [item]
    await store.toggleTodo(1); expect(store.todos[0]?.completed).toBe(true)
    await store.updateTitle(1, 'Новая'); expect(store.todos[0]?.title).toBe('Новая')
    await store.toggleTodo(999); await store.updateTitle(999, 'Нет')
    await store.deleteTodo(1); expect(store.todos).toEqual([])
  })
})
