import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
    { path: '/students', name: 'students', component: () => import('@/views/StudentsView.vue') },
    { path: '/students/:id', name: 'student-detail', component: () => import('@/views/StudentDetailView.vue') },
    { path: '/teachers', name: 'teachers', component: () => import('@/views/TeachersView.vue') },
    { path: '/teachers/:id', name: 'teacher-detail', component: () => import('@/views/TeacherDetailView.vue') },
    { path: '/groups', name: 'groups', component: () => import('@/views/GroupsView.vue') },
    { path: '/groups/:id', name: 'group-detail', component: () => import('@/views/GroupDetailView.vue') },
    { path: '/subjects', name: 'subjects', component: () => import('@/views/SubjectsView.vue') },
    { path: '/schedule', name: 'schedule', component: () => import('@/views/ScheduleView.vue') },
    { path: '/moderation/photos', name: 'moderation-photos', component: () => import('@/views/ModerationPhotosView.vue') },
    { path: '/moderation/yandex', name: 'moderation-yandex', component: () => import('@/views/ModerationYandexView.vue') },
    { path: '/payments', name: 'payments', component: () => import('@/views/PaymentsView.vue') },
    { path: '/coins', name: 'coins', component: () => import('@/views/CoinsView.vue') },
    { path: '/market', name: 'market', component: () => import('@/views/MarketView.vue') },
    { path: '/orders', name: 'orders', component: () => import('@/views/OrdersView.vue') },
    { path: '/surveys', name: 'surveys', component: () => import('@/views/SurveysView.vue') },
    { path: '/surveys/new', name: 'surveys-new', component: () => import('@/views/SurveyNewView.vue') },
    { path: '/surveys/:id/results', name: 'survey-results', component: () => import('@/views/SurveyResultsView.vue') },
    { path: '/profile', name: 'profile', component: () => import('@/views/ProfileView.vue') },
    { path: '/settings', name: 'settings', component: () => import('@/views/SettingsView.vue') },
    { path: '/help', name: 'help', component: () => import('@/views/HelpView.vue') },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
