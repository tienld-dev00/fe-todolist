import HomeView from '@/views/HomeView.vue'
import TaskDetail from '@/components/TaskDetail.vue'
import SignIn from '@/views/SignIn.vue'
import { createRouter, createWebHistory } from 'vue-router'
import TodoListLayout from '@/components/Layouts/TodoListLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/tasks',
      name: 'home',
      component: TodoListLayout,
      children: [
        {
          path: ':groupId',
          component: HomeView,
          children: [
            {
              path: ':taskId',
              component: TaskDetail
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      component: SignIn
    }
  ]
})

export default router
