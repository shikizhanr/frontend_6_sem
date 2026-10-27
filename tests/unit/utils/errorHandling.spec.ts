import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { classifyError, withRetry } from '../../../src/utils/errorHandling'

describe('errorHandling', () => {
  it('классифицирует сетевую ошибку', async () => {
    const mock = new MockAdapter(axios); mock.onGet('/offline').networkError()
    try { await axios.get('/offline') } catch (error) { expect(classifyError(error).kind).toBe('network') }
    mock.restore()
  })
  it('повторяет операцию', async () => {
    let attempt = 0
    const value = await withRetry(async () => { attempt += 1; if (attempt < 2) throw new Error('fail'); return 42 }, 2, 1)
    expect(value).toBe(42); expect(attempt).toBe(2)
  })
  it('классифицирует ответы API и неизвестные значения', async () => {
    const client = axios.create(); const mock = new MockAdapter(client)
    mock.onGet('/validation').reply(422, {}); mock.onGet('/business').reply(500, { message: 'Ошибка сервера' })
    try { await client.get('/validation') } catch (error) { expect(classifyError(error).kind).toBe('validation') }
    try { await client.get('/business') } catch (error) { expect(classifyError(error)).toMatchObject({ kind: 'business', message: 'Ошибка сервера' }) }
    expect(classifyError(new Error('boom')).kind).toBe('unknown')
    expect(classifyError('boom').kind).toBe('unknown')
    mock.restore()
  })
  it('выбрасывает последнюю ошибку после исчерпания retry', async () => {
    await expect(withRetry(async () => { throw new Error('final') }, 2, 1)).rejects.toThrow('final')
  })
})
