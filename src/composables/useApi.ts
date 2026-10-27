import { onBeforeUnmount } from 'vue'

export function useApi(): { signal: AbortSignal; cancel: () => void } {
  const controller = new AbortController()
  onBeforeUnmount(() => controller.abort())
  return { signal: controller.signal, cancel: () => controller.abort() }
}
