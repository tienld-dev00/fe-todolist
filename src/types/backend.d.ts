declare module 'bootstrap/dist/js/bootstrap.min.js'

export interface Task {
  id?: number
  title: string
  description?: string
  due_date?: date
  is_completed?: boolean
  group_id?: number | null
  created_at?: date
  updated_at?: date
}

export interface TaskGroup {
  id?: number
  title: string
  created_at?: date
  updated_at?: date
}

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: date | null
  created_at: date
  updated_at: date
}
