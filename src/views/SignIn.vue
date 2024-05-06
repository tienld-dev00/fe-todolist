<script setup>
import { useAuthStore } from '@/stores/Auth'
import { reactive } from 'vue'

const formData = reactive({
  email: '',
  password: ''
})

const authStore = useAuthStore()

const handleSubmit = () => {
  console.log(formData)
  authStore.login(formData)
}
</script>

<template>
  <div class="d-flex align-items-center py-4 h-100 bg-body-tertiary">
    <main class="form-signin m-auto">
      <form style="width: 400px; height: 100vh" @submit.prevent="handleSubmit">
        <h1 class="h3 mb-3 fw-normal">Log In</h1>

        <div class="form-floating mb-3">
          <input
            name="email"
            type="email"
            class="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            v-model="formData.email"
          />
          <label for="floatingInput">Email</label>
        </div>
        <div class="form-floating mb-3">
          <input
            name="password"
            type="password"
            class="form-control"
            id="floatingPassword"
            placeholder="Password"
            v-model="formData.password"
          />
          <label for="floatingPassword">Password</label>
        </div>
        <button class="btn btn-primary w-100 py-2" type="submit">Log In</button>
      </form>
    </main>
  </div>
</template>
