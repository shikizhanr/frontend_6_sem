import { defineBoot } from '#q-app'
import { pinia } from '../stores'

export default defineBoot(({ app }) => { app.use(pinia) })
