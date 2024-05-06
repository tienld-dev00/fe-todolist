import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  callCreateTaskGroup,
  callDeleteTaskGroup,
  callGetAllTaskGroup,
  callUpdateTaskGroup
} from '@/common/api'
import type { TaskGroup } from '@/types/backend'
import { toast } from 'vue3-toastify'

export const useTaskGroupsStore = defineStore('taskGroups', () => {
  const data = ref<Array<TaskGroup>>([])
  const groupActive = ref<TaskGroup | null>({ title: 'All Task', id: 0 })
  const urlParams = ref<string>('')

  const createTaskGroup = (input: any) => {
    callCreateTaskGroup(input).then((res) => {
      data.value.push(res.data)
      toast.success(res.message)
    })
  }

  const updateTaskGroup = (input: any) => {
    callUpdateTaskGroup(input).then((res: any) => {
      toast.success(res.message)
    })
  }

  const deleteTaskGroup = (id: number) => {
    callDeleteTaskGroup(id).then((res: any) => {
      data.value = data.value.filter((item: any) => item.id !== id)
      toast.success(res.message)
    })
  }

  function setGroupActive(data: any) {
    groupActive.value = data
  }

  callGetAllTaskGroup().then((res: any) => {
    data.value.push(...res.data)
  })

  return {
    data,
    urlParams,
    groupActive,
    setGroupActive,
    createTaskGroup,
    updateTaskGroup,
    deleteTaskGroup
  }
})
