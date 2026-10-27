export interface ITodoItem {
  id: number
  title: string
  completed: boolean
  createdAt: string
  userId: number
  tagIds: number[]
}

export type TodoFilter = 'all' | 'active' | 'completed'
export type CreateTodoInput = Pick<ITodoItem, 'title'> & Partial<Pick<ITodoItem, 'userId' | 'tagIds'>>
export type UpdateTodoInput = Partial<Pick<ITodoItem, 'title' | 'completed' | 'tagIds'>>
