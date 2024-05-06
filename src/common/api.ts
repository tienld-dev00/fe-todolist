import axios from '@/common/axios-custom'

/**
 * Auth
 */
export const callLogin = (data: any) => {
  return axios.post<never, any>('/api/auth/login', data)
}
export const callGetCurrentUserInfo = () => {
  return axios.get<never, any>('/api/auth/user-info')
}

/**
 * CRUD task group
 */
export const callGetAllTaskGroup = () => {
  return axios.get<never, any>('/api/todo/groups')
}
export const callCreateTaskGroup = (data: { title: string }) => {
  return axios.post<never, any>('/api/todo/groups', data)
}
export const callDeleteTaskGroup = (id: number) => {
  return axios.delete<never, any>('/api/todo/groups/' + id)
}
export const callUpdateTaskGroup = (data: any) => {
  return axios.put<never, any>('/api/todo/groups/' + data.id, data)
}

/**
 * CRUD task
 */
export const callGetAllTask = (query?: string) => {
  return axios.get<never, any>('/api/todo/tasks' + (query ? `?${query}` : ''))
}
export const callCreateTask = (data: any) => {
  return axios.post<never, any>('/api/todo/tasks', data)
}
export const callUpdateTask = (data: any) => {
  return axios.put<never, any>('/api/todo/tasks/' + data.id, data)
}
export const callDeleteTask = (id: number) => {
  return axios.delete<never, any>('/api/todo/tasks/' + id)
}
