import { ref } from 'vue'
import { useTodoFilter } from '../../../src/composables/useTodoFilter'
import type { ITodoItem, TodoFilter } from '../../../src/types'

const items: ITodoItem[] = [
  { id: 1, title: 'Изучить Vue', completed: false, createdAt: '2026-01-01', userId: 1, tagIds: [] },
  { id: 2, title: 'Освоить Quasar', completed: true, createdAt: '2026-01-02', userId: 1, tagIds: [] }
]

describe('useTodoFilter', () => {
  it('фильтрует активные задачи', () => {
    const result = useTodoFilter(ref(items), ref<TodoFilter>('active'), ref(''))
    expect(result.value.map((item) => item.id)).toEqual([1])
  })
  it('ищет без учета регистра', () => {
    const result = useTodoFilter(ref(items), ref<TodoFilter>('all'), ref('quasar'))
    expect(result.value.map((item) => item.id)).toEqual([2])
  })
})
