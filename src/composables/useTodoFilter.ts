import { computed, type ComputedRef, type Ref } from 'vue'
import type { ITodoItem, TodoFilter } from '../types'

export function useTodoFilter(todos: Ref<ITodoItem[]>, filter: Ref<TodoFilter>, search: Ref<string>): ComputedRef<ITodoItem[]> {
  return computed(() => {
    const query = search.value.trim().toLocaleLowerCase('ru')
    return todos.value.filter((todo) => {
      const matchesFilter = filter.value === 'all' || (filter.value === 'completed' ? todo.completed : !todo.completed)
      return matchesFilter && (!query || todo.title.toLocaleLowerCase('ru').includes(query))
    })
  })
}
