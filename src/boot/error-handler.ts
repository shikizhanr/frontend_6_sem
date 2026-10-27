import { defineBoot } from '#q-app'
import { installGlobalErrorHandlers } from '../utils/errorHandling'

export default defineBoot(({ app }) => { installGlobalErrorHandlers(app) })
