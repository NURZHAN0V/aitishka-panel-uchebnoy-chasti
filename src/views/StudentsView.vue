<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/core/layouts/AppLayout.vue'
import {
  BaseAvatar,
  BaseButton,
  BaseCard,
  BaseChip,
  BaseInput,
  BaseModal,
  BaseSelect,
} from '@/core/components/ui'
import { useToast } from '@/core/composables/useToast.js'
import {
  GROUPS,
  STUDENTS,
  STATUS_LABELS,
  getGroupById,
} from '@/modules/shared/constants/entities.js'
import {
  PASSWORD_QUEUE,
  PASSWORD_QUEUE_STATUS,
  STUDENT_STATUS_FILTERS,
  formatDateRu,
  formatDebt,
} from '@/modules/students/constants/students.js'

const router = useRouter()
const toast = useToast()

const search = ref('')
const statusFilter = ref('active')
const queue = reactive(PASSWORD_QUEUE.map((item) => ({ ...item })))
const createOpen = ref(false)
const createForm = reactive({
  name: '',
  email: '',
  phone: '',
  dob: '',
  groupId: GROUPS[0]?.id || '',
})

const groupOptions = GROUPS.map((g) => ({ value: g.id, label: g.name }))

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return STUDENTS.filter((s) => {
    if (statusFilter.value !== 'all' && s.status !== statusFilter.value) return false
    if (q && !s.name.toLowerCase().includes(q)) return false
    return true
  })
})

const newQueueItems = computed(() => queue.filter((item) => item.status === 'new'))

function statusVariant(status) {
  if (status === 'active') return 'approved'
  if (status === 'transferred') return 'pending'
  return 'rejected'
}

function openStudent(id) {
  router.push(`/students/${id}`)
}

function processRequest(item) {
  item.status = 'processed'
  toast.success(`Заявка «${item.name}» обработана, письмо отправлено`)
}

function rejectRequest(item) {
  item.status = 'rejected'
  toast.info(`Заявка «${item.name}» отклонена`)
}

function resetCreateForm() {
  createForm.name = ''
  createForm.email = ''
  createForm.phone = ''
  createForm.dob = ''
  createForm.groupId = GROUPS[0]?.id || ''
}

function openCreate() {
  resetCreateForm()
  createOpen.value = true
}

function submitCreate() {
  if (!createForm.name.trim() || !createForm.email.trim() || !createForm.groupId) {
    toast.error('Заполните ФИО, почту и группу')
    return
  }

  const id = `s-${Date.now()}`
  STUDENTS.push({
    id,
    name: createForm.name.trim(),
    groupId: createForm.groupId,
    status: 'active',
    dob: createForm.dob || '2014-01-01',
    email: createForm.email.trim(),
    phone: createForm.phone.trim() || '—',
    paymentCode: `NEW-${String(STUDENTS.length + 1).padStart(4, '0')}`,
    coins: 0,
    debt: 0,
    attendanceStreak: 0,
    homeworkStreak: 0,
    avgGrade: 0,
    attendance: 0,
  })

  createOpen.value = false
  toast.success('Студент создан, логин и пароль отправлены на почту')
  router.push(`/students/${id}`)
}
</script>

<template>
  <AppLayout
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Студенты' }]"
    active-route="students"
  >
    <div class="page">
      <header class="page__header">
        <div>
          <h1 class="page__title">Студенты</h1>
          <p class="page__subtitle">Поиск, статусы и заявки на восстановление доступа</p>
        </div>
        <BaseButton variant="primary" icon="user" @click="openCreate">
          Создать студента
        </BaseButton>
      </header>

      <div class="page__filters">
        <BaseInput
          v-model="search"
          label="Поиск"
          placeholder="ФИО студента"
        />
      </div>

      <div class="page__chips">
        <BaseChip
          v-for="chip in STUDENT_STATUS_FILTERS"
          :key="chip.id"
          mode="filter"
          :active="statusFilter === chip.id"
          @click="statusFilter = chip.id"
        >
          {{ chip.label }}
        </BaseChip>
      </div>

      <section v-if="newQueueItems.length" class="queue" aria-label="Забыли пароль">
        <header class="queue__header">
          <h2 class="queue__title">Забыли пароль</h2>
          <span class="queue__count">{{ newQueueItems.length }}</span>
        </header>
        <ul class="queue__list">
          <li v-for="item in newQueueItems" :key="item.id" class="queue__item">
            <div class="queue__info">
              <strong>{{ item.name }}</strong>
              <p>
                {{ formatDateRu(item.dob) }} · {{ item.groupName }} · {{ item.email }}
              </p>
              <BaseChip variant="pending" size="sm">
                {{ PASSWORD_QUEUE_STATUS[item.status] }}
              </BaseChip>
            </div>
            <div class="queue__actions">
              <BaseButton variant="primary" size="sm" @click="processRequest(item)">
                Обработать
              </BaseButton>
              <BaseButton variant="secondary" size="sm" @click="rejectRequest(item)">
                Отклонить
              </BaseButton>
            </div>
          </li>
        </ul>
      </section>

      <div v-if="!filtered.length" class="page__empty">Студенты не найдены</div>

      <div v-else class="students-grid">
        <button
          v-for="student in filtered"
          :key="student.id"
          type="button"
          class="student-card-btn"
          @click="openStudent(student.id)"
        >
          <BaseCard padding="md" class="student-card">
            <div class="student-card__head">
              <BaseAvatar :name="student.name" size="lg" />
              <div class="student-card__info">
                <h3 class="student-card__name">{{ student.name }}</h3>
                <p class="student-card__group">
                  {{ getGroupById(student.groupId)?.name || '—' }}
                </p>
                <BaseChip :variant="statusVariant(student.status)" size="sm">
                  {{ STATUS_LABELS[student.status] }}
                </BaseChip>
              </div>
            </div>
            <dl class="student-card__stats">
              <div>
                <dt>Долг</dt>
                <dd :class="{ 'is-debt': student.debt > 0 }">
                  {{ formatDebt(student.debt) }}
                </dd>
              </div>
              <div>
                <dt>Коины</dt>
                <dd>{{ student.coins }}</dd>
              </div>
            </dl>
          </BaseCard>
        </button>
      </div>
    </div>

    <BaseModal v-model="createOpen" title="Новый студент" size="md">
      <div class="form-grid">
        <BaseInput v-model="createForm.name" label="ФИО" placeholder="Имя Фамилия" />
        <BaseInput v-model="createForm.email" label="Почта" type="email" />
        <BaseInput v-model="createForm.phone" label="Телефон" />
        <BaseInput v-model="createForm.dob" label="Дата рождения" type="date" />
        <BaseSelect
          v-model="createForm.groupId"
          label="Группа"
          :options="groupOptions"
        />
      </div>
      <template #footer>
        <BaseButton variant="secondary" @click="createOpen = false">Отмена</BaseButton>
        <BaseButton variant="primary" @click="submitCreate">Создать</BaseButton>
      </template>
    </BaseModal>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.page {
  padding: $space-4 $space-6 $space-6;
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

.page__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: $space-4;
}

.page__title {
  margin: 0 0 $space-1;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.page__subtitle {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.page__filters {
  max-width: 420px;
}

.page__chips {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2;
}

.page__empty {
  padding: $space-8;
  text-align: center;
  color: $color-text-muted;
  background: $color-bg-muted;
  border-radius: $radius-card;
}

.queue {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  padding: $space-4;
  border-radius: $radius-card;
  background: $color-warning-light;
}

.queue__header {
  display: flex;
  align-items: center;
  gap: $space-2;
}

.queue__title {
  margin: 0;
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.queue__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 $space-2;
  border-radius: 999px;
  background: $color-warning;
  color: $color-text-inverse;
  font-size: $font-size-xs;
  font-weight: $font-weight-bold;
}

.queue__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.queue__item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: $space-3;
  padding: $space-3 $space-4;
  border-radius: $radius-md;
  background: $color-bg-card;
}

.queue__info {
  display: flex;
  flex-direction: column;
  gap: $space-1;
  min-width: 0;

  strong {
    color: $color-text-primary;
  }

  p {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-secondary;
  }
}

.queue__actions {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2;
}

.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: $space-4;
}

.student-card-btn {
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  border-radius: $radius-card;
  transition: transform $transition-fast;

  &:hover {
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }
}

.student-card__head {
  display: flex;
  gap: $space-4;
  margin-bottom: $space-4;
}

.student-card__name {
  margin: 0 0 $space-1;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.student-card__group {
  margin: 0 0 $space-2;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.student-card__stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-3;
  margin: 0;

  dt {
    margin: 0;
    font-size: $font-size-xs;
    color: $color-text-muted;
  }

  dd {
    margin: $space-1 0 0;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;

    &.is-debt {
      color: $color-error;
    }
  }
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}
</style>
