import { mount } from '@vue/test-utils'
import TodoItem from '../../src/components/TodoItem.vue'

const todo = { id: 1, title: 'Проверить компонент', completed: false, createdAt: '2026-10-27T10:00:00Z', userId: 1, tagIds: [] }
describe('TodoItem', () => {
  it('отображает задачу и отправляет события', async () => {
    const wrapper = mount(TodoItem, { props: { todo } })
    expect(wrapper.text()).toContain(todo.title)
    await wrapper.find('input').trigger('change')
    expect(wrapper.emitted('toggle')?.[0]).toEqual([1])
  })
})
