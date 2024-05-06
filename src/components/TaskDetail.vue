<script setup lang="ts">
import { useTaskGroupsStore } from '@/stores/TaskGroups'
import { useTasksStore } from '@/stores/Tasks'
import type { Task } from '@/types/backend'
import moment from 'moment'

const tasksStore = useTasksStore()
const taskGroupsStore = useTaskGroupsStore()
let timeoutId: any

console.log(tasksStore.taskActive?.group_id)

const handleChange = (task: Task | any) => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  timeoutId = setTimeout(() => {
    task.updated_at = new Date()
    tasksStore.updateTask(task)
  }, 1000)
}

const setMinDatetime = (event: any) => {
  event.target.min = new Date().toISOString().slice(0, 16)
}
</script>

<template>
  <div
    v-if="tasksStore.taskActive"
    class="col-4 d-flex flex-column pt-3 bg-body-tertiary"
    style="height: 100vh"
  >
    <div class="input-group mb-3">
      <span class="input-group-text" id="basic-addon1">
        <input
          type="checkbox"
          :checked="tasksStore.taskActive.is_completed"
          class="form-check-input"
          @click="tasksStore.updateTask(tasksStore.taskActive)"
        />
      </span>
      <input
        type="text"
        v-model="tasksStore.taskActive.title"
        class="form-control"
        placeholder="Title"
        @keyup="handleChange(tasksStore.taskActive)"
      />
    </div>

    <div class="form-floating mb-3">
      <select
        class="form-select"
        aria-label="Default select example"
        v-model="tasksStore.taskActive.group_id"
        @change="handleChange(tasksStore.taskActive)"
      >
        <option selected :value="null">None</option>
        <option
          v-for="item in taskGroupsStore.data"
          :value="item.id"
          :selected="item.id === tasksStore.taskActive.group_id"
          :key="item.id"
        >
          {{ item.title }}
        </option>
      </select>
      <label for="floatingInput">Group task</label>
    </div>

    <div class="form-floating mb-3">
      <input
        id="floatingInput"
        type="datetime-local"
        v-model="tasksStore.taskActive.due_date"
        min="now"
        class="form-control"
        @change="handleChange(tasksStore.taskActive)"
        @click="setMinDatetime"
      />
      <label for="floatingInput">Due date</label>
    </div>

    <div class="form-floating mb-3">
      <textarea
        class="form-control h-100"
        v-model="tasksStore.taskActive.description"
        rows="5"
        @keyup="handleChange(tasksStore.taskActive)"
      >
      </textarea>
      <label for="floatingInput">Description</label>
    </div>

    <span class="mt-auto fw-light pb-3 text-center">
      Updated {{ moment(tasksStore.taskActive.updated_at).fromNow() }}
    </span>
  </div>
</template>
