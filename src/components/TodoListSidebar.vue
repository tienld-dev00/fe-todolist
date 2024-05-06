<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useTaskGroupsStore } from '@/stores/TaskGroups'
import type { TaskGroup } from '@/types/backend'
import { useTasksStore } from '@/stores/Tasks'
import { useRoute } from 'vue-router'
import { useSearchStore } from '@/stores/query'
import { useAuthStore } from '@/stores/Auth'

const taskGroupsStore = useTaskGroupsStore()
const tasksStore = useTasksStore()
const searchStore = useSearchStore()
const authStore = useAuthStore()
const newGroup = reactive({ title: '' })
const route = useRoute()

watch(
  () => route.params.groupId,
  async (newId) => {
    let query
    taskGroupsStore.urlParams = ''
    taskGroupsStore.urlParams += newId === 'all' ? '' : 'filters[group_id]=' + newId
    query = taskGroupsStore.urlParams + '&' + tasksStore.urlParams
    searchStore.searchText = ''
    await tasksStore.fetchTasks(query)
    tasksStore.isLoading = false
  }
)
let timeoutId: any = null

const handleShowEdit = (event: any) => {
  event.target.setAttribute('contenteditable', true)
  event.target.focus()
}

const handleUpdateTaskGroup = (event: any, taskGroups: TaskGroup) => {
  event.target.setAttribute('contenteditable', false)
  if (taskGroups.title !== event.target.innerText) {
    taskGroups.title = event.target.innerText
    taskGroupsStore.updateTaskGroup(taskGroups)
  }
}

const handleSearchChange = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  timeoutId = setTimeout(() => {
    if (searchStore.searchText.length === 0) {
      tasksStore.fetchTasks(tasksStore.urlParams + '&' + taskGroupsStore.urlParams)
      return
    }
    let query = 'search=' + searchStore.searchText
    tasksStore.fetchTasks(query)
  }, 500)
}
</script>

<template>
  <div class="d-flex flex-column" style="height: 100vh">
    <div class="d-flex justify-content-between mb-2">
      <span class="fs-2 fw-bold pb-2">To Do List</span>
      <div class="dropdown align-self-center">
        <button
          class="btn btn-outline-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {{ authStore.authData.user.name }}
        </button>
        <ul class="dropdown-menu">
          <li>
            <a class="dropdown-item text-danger" href="#" @click.prevent="authStore.logout"
              >Log Out</a
            >
          </li>
        </ul>
      </div>
    </div>

    <input
      type="text"
      v-model="searchStore.searchText"
      @keyup="handleSearchChange"
      class="form-control mb-2"
      placeholder="Search"
    />
    <span class="pb-2">Group tasks</span>
    <div class="list-group">
      <router-link
        to="/tasks/all"
        :class="{
          'list-group-item list-group-item-action': true,
          'bg-light-subtle': taskGroupsStore.groupActive && taskGroupsStore.groupActive.id === 0
        }"
        @click="taskGroupsStore.setGroupActive({ title: 'All Task', id: 0 })"
      >
        All task
      </router-link>
    </div>
    <div class="list-group mt-2 overflow-auto">
      <router-link
        :to="`/tasks/${item.id}`"
        v-for="item in taskGroupsStore.data"
        :key="item.id"
        @click="taskGroupsStore.setGroupActive(item)"
        :class="{
          'list-group-item': true,
          'list-group-item-action': true,
          'bg-light-subtle':
            taskGroupsStore.groupActive && taskGroupsStore.groupActive.id === item.id
        }"
      >
        <div class="d-flex justify-content-between">
          <span
            class="w-100 me-1"
            @dblclick="handleShowEdit"
            @blur="handleUpdateTaskGroup($event, item)"
            >{{ item.title }}</span
          >
          <div
            class="btn-hidden"
            @click.prevent.stop="taskGroupsStore.deleteTaskGroup(item.id ?? 0)"
          >
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
    <div class="mb-3 mt-auto">
      <input
        type="text"
        @keydown.enter="taskGroupsStore.createTaskGroup(newGroup)"
        v-model="newGroup.title"
        class="form-control mt-auto mb-3"
        placeholder="New group"
      />
    </div>
  </div>
</template>

<style scoped>
.list-group-item:hover .btn-hidden {
  display: block;
}
.btn-hidden {
  display: none;
}
</style>
