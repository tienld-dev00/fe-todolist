import { ref } from 'vue'
import { defineStore } from 'pinia'
import { callCreateTask, callDeleteTask, callGetAllTask, callUpdateTask } from '@/common/api'
import type { Task } from '@/types/backend'
import { toast } from 'vue3-toastify'

export const useTasksStore = defineStore('tasks', () => {
  const data = ref<Array<Task>>([])
  const taskActive = ref<Task | null>(null)
  const urlParams = ref<string>('')
  const isLoading = ref<boolean>(false)

  const createTask = (input: any) => {
    callCreateTask(input).then((res: any) => {
      data.value.push(res.data)
      toast.success(res.message)
    })
  }

  const updateTask = (input: Task | any) => {
    callUpdateTask(input).then((res: any) => {
      toast.success(res.message)
    })
  }

  const deleteTask = (id: number) => {
    callDeleteTask(id).then((res: any) => {
      data.value = data.value.filter((item: any) => item.id !== id)
      toast.success(res.message)
    })
  }

  const setTaskActive = (data: any) => {
    taskActive.value = data
  }

  const fetchTasks = async (query?: string) => {
    isLoading.value = true
    await callGetAllTask(query).then((res: any) => {
      isLoading.value = false
      data.value = res.data
    })
  }

  return {
    data,
    urlParams,
    taskActive,
    isLoading,
    setTaskActive,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks
  }
})
