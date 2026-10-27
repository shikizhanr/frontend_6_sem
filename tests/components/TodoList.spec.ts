import { mount } from '@vue/test-utils'
import TodoList from '../../src/components/TodoList.vue'

describe('TodoList', () => {
  it('показывает пустое состояние', () => {
    const wrapper = mount(TodoList, { props: { todos: [] } })
    expect(wrapper.text()).toContain('Задач пока нет')
  })
  it('показывает переданные задачи', () => {
    const wrapper = mount(TodoList, { props: { todos: [{ id: 1, title: 'Задача', completed: false, createdAt: '2026-01-01', userId: 1, tagIds: [] }] } })
    expect(wrapper.text()).toContain('Задача')
  })
})
