<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useTasksStore } from '@/stores/Tasks'
import type { Task } from '@/types/backend'
import { useTaskGroupsStore } from '@/stores/TaskGroups'
import { useSearchStore } from '@/stores/query'

const tasksStore = useTasksStore()
const taskGroupsStore = useTaskGroupsStore()
const searchStore = useSearchStore()

const newTask = reactive<Task>({
  title: '',
  due_date: null
})

const direction = ref<'desc' | 'asc'>('asc')
const sort = ref('creation_date')
const filter = ref('active')

const handleCreateTask = (task: Task) => {
  if (task.title.length > 0) {
    task.group_id = taskGroupsStore.groupActive?.id !== 0 ? taskGroupsStore.groupActive?.id : null
    tasksStore.createTask(task)
    newTask.title = ''
    newTask.due_date = null
  }
}

const getTasksByQuery = () => {
  let query
  tasksStore.urlParams = ''
  switch (filter.value) {
    case 'overdue':
      tasksStore.urlParams +=
        'filters[due_date]=<,' + new Date().toISOString() + '&filters[is_completed]=0'
      break
    case 'active':
      tasksStore.urlParams += 'filters[is_completed]=0'
      break
    case 'completed':
      tasksStore.urlParams += 'filters[is_completed]=1'
      break
    default:
      break
  }

  tasksStore.urlParams += '&'

  switch (sort.value) {
    case 'creation_date':
      tasksStore.urlParams += `sorts[created_at]=${direction.value}`
      break
    case 'alphabetically':
      tasksStore.urlParams += `sorts[title]=${direction.value}`
      break
    case 'due_date':
      tasksStore.urlParams += `sorts[due_date]=${direction.value}`
      break

    default:
      break
  }

  query =
    tasksStore.urlParams +
    '&' +
    taskGroupsStore.urlParams +
    (searchStore.searchText ? `&search=${searchStore.searchText}` : '')
  tasksStore.fetchTasks(query)
}
watch(direction, () => {
  getTasksByQuery()
})

getTasksByQuery()
</script>

<template>
  <div class="row">
    <div
      :class="{
        'pt-3 col d-flex flex-column': true,
        'col-8': $route.params.taskId && tasksStore.taskActive
      }"
      style="height: 100vh"
    >
      <div class="d-flex gap-3 mb-3 justify-content-between">
        <p class="fs-3 fw-bold" v-if="searchStore.searchText.length > 0">Search result</p>
        <p
          class="fs-3 fw-bold"
          v-else-if="taskGroupsStore?.groupActive && taskGroupsStore.groupActive.title"
        >
          {{ taskGroupsStore.groupActive.title }}
        </p>
        <div class="d-flex align-items-center gap-3">
          <div v-if="direction === 'asc'" @click="direction = 'desc'" class="test">
            <svg
              style="width: 24px; height: 24px"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
            >
              <path
                fill="#74C0FC"
                d="M151.6 42.4C145.5 35.8 137 32 128 32s-17.5 3.8-23.6 10.4l-88 96c-11.9 13-11.1 33.3 2 45.2s33.3 11.1 45.2-2L96 146.3V448c0 17.7 14.3 32 32 32s32-14.3 32-32V146.3l32.4 35.4c11.9 13 32.2 13.9 45.2 2s13.9-32.2 2-45.2l-88-96zM320 480h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H320c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H320c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H320c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128H544c17.7 0 32-14.3 32-32s-14.3-32-32-32H320c-17.7 0-32 14.3-32 32s14.3 32 32 32z"
              />
            </svg>
          </div>
          <div v-else @click="direction = 'asc'">
            <svg
              style="width: 24px; height: 24px"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
            >
              <path
                fill="#74C0FC"
                d="M151.6 469.6C145.5 476.2 137 480 128 480s-17.5-3.8-23.6-10.4l-88-96c-11.9-13-11.1-33.3 2-45.2s33.3-11.1 45.2 2L96 365.7V64c0-17.7 14.3-32 32-32s32 14.3 32 32V365.7l32.4-35.4c11.9-13 32.2-13.9 45.2-2s13.9 32.2 2 45.2l-88 96zM320 480c-17.7 0-32-14.3-32-32s14.3-32 32-32h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H320zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H320zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H320zm0-128c-17.7 0-32-14.3-32-32s14.3-32 32-32H544c17.7 0 32 14.3 32 32s-14.3 32-32 32H320z"
              />
            </svg>
          </div>
          <div class="form-floating">
            <select
              class="form-select"
              id="floatingSelect"
              aria-label="Floating label select example"
              @change="getTasksByQuery"
              v-model="filter"
            >
              <option value="">All</option>
              <option value="overdue">Overdue</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            <label for="floatingSelect">Filter by</label>
          </div>
          <div class="form-floating">
            <select
              class="form-select"
              id="floatingSelect"
              aria-label="Floating label select example"
              v-model="sort"
              @change="getTasksByQuery"
            >
              <option value="creation_date">Creation date</option>
              <option value="alphabetically">Alphabetically</option>
              <option value="due_date">Due date</option>
            </select>
            <label for="floatingSelect">Sort by</label>
          </div>
        </div>
      </div>

      <task-list />

      <div
        class="d-flex gap-3 mt-auto mb-3 bg-body-tertiary rounded-2"
        style="bottom: 16px; height: 60px"
      >
        <input
          v-model="newTask.title"
          @keydown.enter="handleCreateTask(newTask)"
          type="text"
          class="form-control bg-body-tertiary border-0 flex-grow-1"
          placeholder="New task"
        />
        <input
          id="due-date"
          v-model="newTask.due_date"
          @keydown.enter="handleCreateTask(newTask)"
          type="datetime-local"
          class="form-control bg-body-tertiary border-0 w-50"
          style="width: max-content"
          placeholder="New task"
        />
      </div>
    </div>
    <router-view />
  </div>
</template>
