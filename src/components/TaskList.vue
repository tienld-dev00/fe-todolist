<script setup lang="ts">
import moment from 'moment'
import { useTasksStore } from '@/stores/Tasks'
import type { Task } from '@/types/backend'
import { useTaskGroupsStore } from '@/stores/TaskGroups'
import { useSearchStore } from '@/stores/query'

const tasksStore = useTasksStore()
const taskGroupsStore = useTaskGroupsStore()
const searchStore = useSearchStore()

const handleCheck = (task: Task) => {
  task.is_completed = !task.is_completed
  task.updated_at = new Date()
  tasksStore.updateTask(task)
}

const handleDeleteTask = (id: number) => {
  tasksStore.deleteTask(id)
  if (tasksStore.taskActive && tasksStore.taskActive.id === id) {
    tasksStore.setTaskActive(null)
  }
}
</script>

<template>
  <div v-if="tasksStore.isLoading" style="height: 100%">
    <span class="fs-1 fw-bold">Loading...</span>
  </div>
  <div
    v-else-if="tasksStore.data.length > 0"
    class="list-group list-group-flush overflow-x-hidden overflow-y-auto"
    style="height: 100%"
  >
    <router-link
      v-for="item in tasksStore.data"
      :to="`/tasks/${$route.params.groupId}/${item.id}`"
      :key="item.id"
      @click="tasksStore.setTaskActive(item)"
      :class="{
        'list-group-item  list-group-item-action': true,
        'bg-light-subtle': item.id === tasksStore.taskActive?.id
      }"
    >
      <div class="d-flex task-item align-items-center">
        <input
          class="form-check-input me-3"
          type="checkbox"
          @click.stop="handleCheck(item)"
          :value="item.id"
          :checked="item.is_completed"
        />
        <div class="flex-grow-1 me-3 overflow-hidden">
          <h5
            :class="{
              'mb-1 text-truncate': true,
              'text-decoration-line-through': item.is_completed
            }"
          >
            {{ item.title }}
          </h5>
          <p v-if="item.description && searchStore.searchText" class="mb-1">
            {{ item.description }}
          </p>
          <small class="text-body-secondary d-flex gap-2">
            <span class="badge text-bg-secondary">
              {{ taskGroupsStore.data.find((group) => group.id === item.group_id)?.title }}
            </span>
            <span
              v-if="item.due_date"
              :class="{
                badge: true,
                'text-bg-primary': new Date(item.due_date) >= new Date(),
                'text-bg-danger': new Date(item.due_date) < new Date() && !item.is_completed,
                'text-bg-warning': new Date(item.due_date) < new Date() && item.is_completed
              }"
            >
              {{ 'Due ' + moment(item.due_date).fromNow() }}
            </span>
          </small>
        </div>
        <div class="btn-delete" @click.prevent.stop="handleDeleteTask(item.id ?? 0)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-trash"
            viewBox="0 0 16 16"
          >
            <path
              d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
            />
            <path
              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
            />
          </svg>
        </div>
      </div>
    </router-link>
  </div>
  <span v-else class="fs-1 fw-bold text-center align-content-center" style="height: 100%">
    No Data
  </span>
</template>
<style scoped>
.task-item:hover .btn-delete {
  display: block;
}
.btn-delete {
  display: none;
}
</style>
