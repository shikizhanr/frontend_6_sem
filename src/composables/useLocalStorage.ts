import { ref, watch, type Ref } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  const raw = localStorage.getItem(key)
  let initial = defaultValue
  if (raw !== null) {
    try { initial = JSON.parse(raw) as T } catch { localStorage.removeItem(key) }
  }
  const state = ref(initial) as Ref<T>
  watch(state, (value) => localStorage.setItem(key, JSON.stringify(value)), { deep: true })
  return state
}
