import { normalizeText } from '../../../src/utils/formHelpers'
import { isEmailUnique, validateEmail, validatePassword, validateTodoTitle } from '../../../src/utils/validation'

describe('validation', () => {
  it('проверяет email', () => { expect(validateEmail('user@example.com')).toBe(true); expect(validateEmail('bad')).not.toBe(true) })
  it('проверяет пароль', () => { expect(validatePassword('123456')).toBe(true); expect(validatePassword('123')).not.toBe(true) })
  it('не принимает пустую задачу', () => { expect(validateTodoTitle('   ')).not.toBe(true) })
  it('нормализует пробелы', () => { expect(normalizeText('  один   два  ')).toBe('один два') })
  it('проверяет уникальность email', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    fetchMock.mockResolvedValueOnce(new Response('[]', { status: 200 }))
    await expect(isEmailUnique('new@example.com')).resolves.toBe(true)
    fetchMock.mockResolvedValueOnce(new Response('[{"id":1}]', { status: 200 }))
    await expect(isEmailUnique('used@example.com')).resolves.toBe('Этот email уже зарегистрирован')
    fetchMock.mockResolvedValueOnce(new Response('', { status: 500 }))
    await expect(isEmailUnique('new@example.com')).resolves.toBe('Не удалось проверить email')
    await expect(isEmailUnique('bad')).resolves.toBe('Введите корректный email')
    fetchMock.mockRestore()
  })
})
