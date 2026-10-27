import { mount } from '@vue/test-utils'
import TodoForm from '../../src/components/TodoForm.vue'

describe('TodoForm', () => {
  it('отправляет непустое название', async () => {
    const wrapper = mount(TodoForm)
    await wrapper.find('input').setValue('  Новая задача  ')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('add')?.[0]).toEqual(['Новая задача'])
  })
  it('не отправляет пустое название', async () => {
    const wrapper = mount(TodoForm)
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('add')).toBeUndefined()
  })
})
