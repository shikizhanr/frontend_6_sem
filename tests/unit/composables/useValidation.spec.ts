import { z } from 'zod'
import { useValidation } from '../../../src/composables/useValidation'

describe('useValidation', () => {
  const schema = z.object({ name: z.string().min(2, 'Слишком коротко') })
  it('возвращает ошибку поля', () => {
    const form = useValidation({ name: '' }, schema)
    expect(form.validate()).toBe(false)
    expect(form.errors.name).toBe('Слишком коротко')
  })
  it('сбрасывает форму', () => {
    const form = useValidation({ name: 'Иван' }, schema)
    form.values.name = 'Петр'; form.reset()
    expect(form.values.name).toBe('Иван')
  })
  it('валидирует отдельное поле и корректную форму', () => {
    const form = useValidation({ name: 'Иван' }, schema)
    expect(form.validateField('name')).toBe(true)
    expect(form.validate()).toBe(true)
    form.values.name = ''
    expect(form.validateField('name')).toBe(false)
    expect(form.isValid.value).toBe(false)
  })
})
