<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
import { useConfirm } from '@/core/composables/useConfirm.js'
import { useToast } from '@/core/composables/useToast.js'
import {
  GROUPS,
  STATUS_LABELS,
  getGroupById,
  getStudentById,
} from '@/modules/shared/constants/entities.js'
import {
  formatDateRu,
  formatDebt,
  getTeacherReviews,
} from '@/modules/students/constants/students.js'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { confirm } = useConfirm()

const student = computed(() => getStudentById(route.params.id))
const group = computed(() => (student.value ? getGroupById(student.value.groupId) : null))
const isLimited = computed(
  () => student.value?.status === 'transferred' || student.value?.status === 'expelled',
)
const reviews = computed(() => (student.value ? getTeacherReviews(student.value.id) : []))

const groupOptions = GROUPS.map((g) => ({ value: g.id, label: g.name }))

const contactsOpen = ref(false)
const transferOpen = ref(false)
const contactsForm = reactive({ email: '', phone: '' })
const transferGroupId = ref('')

watch(
  student,
  (value) => {
    if (!value) return
    contactsForm.email = value.email
    contactsForm.phone = value.phone
    transferGroupId.value = value.groupId
  },
  { immediate: true },
)

function statusVariant(status) {
  if (status === 'active') return 'approved'
  if (status === 'transferred') return 'pending'
  return 'rejected'
}

function openContacts() {
  if (!student.value) return
  contactsForm.email = student.value.email
  contactsForm.phone = student.value.phone
  contactsOpen.value = true
}

function saveContacts() {
  if (!student.value) return
  student.value.email = contactsForm.email.trim()
  student.value.phone = contactsForm.phone.trim()
  contactsOpen.value = false
  toast.success('Контакты обновлены')
}

function openTransfer() {
  if (!student.value) return
  transferGroupId.value = student.value.groupId
  transferOpen.value = true
}

function saveTransfer() {
  if (!student.value || !transferGroupId.value) return
  if (transferGroupId.value === student.value.groupId) {
    toast.info('Студент уже в этой группе')
    return
  }
  student.value.groupId = transferGroupId.value
  student.value.status = 'active'
  transferOpen.value = false
  toast.success(`Студент переведён в ${getGroupById(transferGroupId.value)?.name}`)
}

async function expelStudent() {
  if (!student.value) return
  const ok = await confirm({
    title: 'Отчислить студента?',
    message: `${student.value.name} будет отчислен. Аккаунт сохранится в архиве, доступ закроется.`,
    confirmText: 'Отчислить',
    cancelText: 'Отмена',
    variant: 'primary',
  })
  if (!ok) return
  student.value.status = 'expelled'
  toast.success('Студент отчислен')
}

function resetPassword() {
  if (!student.value) return
  toast.success(`Новый пароль отправлен на ${student.value.email}`)
}
</script>

<template>
  <AppLayout
    :breadcrumbs="[
      { label: 'Главная', href: '/' },
      { label: 'Студенты', href: '/students' },
      { label: student?.name || 'Студент' },
    ]"
    active-route="students"
  >
    <div class="page">
      <div v-if="!student" class="page__empty">
        Студент не найден
        <BaseButton variant="secondary" as="a" href="/students">К списку</BaseButton>
      </div>

      <template v-else>
        <BaseCard padding="md">
          <div class="profile">
            <BaseAvatar :name="student.name" size="xl" />
            <div class="profile__info">
              <h1 class="profile__title">{{ student.name }}</h1>
              <p class="profile__meta">
                {{ group?.name || '—' }} ·
                <BaseChip :variant="statusVariant(student.status)" size="sm">
                  {{ STATUS_LABELS[student.status] }}
                </BaseChip>
              </p>
              <dl class="profile__fields">
                <div>
                  <dt>Дата рождения</dt>
                  <dd>{{ formatDateRu(student.dob) }}</dd>
                </div>
                <div>
                  <dt>Почта</dt>
                  <dd>{{ student.email }}</dd>
                </div>
                <div>
                  <dt>Телефон</dt>
                  <dd>{{ student.phone }}</dd>
                </div>
                <div>
                  <dt>Код оплаты</dt>
                  <dd class="profile__code">{{ student.paymentCode }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div v-if="isLimited" class="notice" role="status">
            Доступны ограниченные действия
            ({{ student.status === 'transferred' ? 'студент переведён' : 'студент отчислен' }}).
          </div>

          <div class="actions">
            <BaseButton
              v-if="!isLimited"
              variant="secondary"
              icon="pencil-edit-02"
              @click="openContacts"
            >
              Контакты
            </BaseButton>
            <BaseButton
              v-if="!isLimited"
              variant="secondary"
              icon="user-group"
              @click="openTransfer"
            >
              Перевести
            </BaseButton>
            <BaseButton
              v-if="!isLimited"
              variant="secondary"
              @click="expelStudent"
            >
              Отчислить
            </BaseButton>
            <BaseButton
              v-if="student.status !== 'expelled'"
              variant="primary"
              @click="resetPassword"
            >
              Сбросить пароль
            </BaseButton>
          </div>
        </BaseCard>

        <section class="stats" aria-label="Показатели">
          <BaseCard padding="md" class="stat">
            <p class="stat__label">Коины</p>
            <p class="stat__value">{{ student.coins }}</p>
          </BaseCard>
          <BaseCard padding="md" class="stat">
            <p class="stat__label">Задолженность</p>
            <p class="stat__value" :class="{ 'is-debt': student.debt > 0 }">
              {{ formatDebt(student.debt) }}
            </p>
          </BaseCard>
          <BaseCard padding="md" class="stat">
            <p class="stat__label">Серия без пропусков</p>
            <p class="stat__value">{{ student.attendanceStreak }}</p>
          </BaseCard>
          <BaseCard padding="md" class="stat">
            <p class="stat__label">Серия ДЗ вовремя</p>
            <p class="stat__value">{{ student.homeworkStreak }}</p>
          </BaseCard>
        </section>

        <section class="reviews">
          <h2 class="reviews__title">Отзывы преподавателей</h2>
          <div v-if="!reviews.length" class="page__empty-block">Отзывов пока нет</div>
          <ul v-else class="reviews__list">
            <li v-for="review in reviews" :key="review.id" class="reviews__item">
              <div class="reviews__head">
                <strong>{{ review.teacher }}</strong>
                <span>{{ formatDateRu(review.date) }}</span>
              </div>
              <p class="reviews__subject">{{ review.subject }}</p>
              <p class="reviews__text">{{ review.text }}</p>
            </li>
          </ul>
        </section>
      </template>
    </div>

    <BaseModal v-model="contactsOpen" title="Редактировать контакты" size="sm">
      <div class="form-grid">
        <BaseInput v-model="contactsForm.email" label="Почта" type="email" />
        <BaseInput v-model="contactsForm.phone" label="Телефон" />
      </div>
      <template #footer>
        <BaseButton variant="secondary" @click="contactsOpen = false">Отмена</BaseButton>
        <BaseButton variant="primary" @click="saveContacts">Сохранить</BaseButton>
      </template>
    </BaseModal>

    <BaseModal v-model="transferOpen" title="Перевод в группу" size="sm">
      <BaseSelect
        v-model="transferGroupId"
        label="Новая группа"
        :options="groupOptions"
      />
      <template #footer>
        <BaseButton variant="secondary" @click="transferOpen = false">Отмена</BaseButton>
        <BaseButton variant="primary" @click="saveTransfer">Перевести</BaseButton>
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

.page__empty {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $space-4;
  color: $color-text-muted;
}

.page__empty-block {
  padding: $space-6;
  text-align: center;
  color: $color-text-muted;
  background: $color-bg-muted;
  border-radius: $radius-card;
}

.profile {
  display: flex;
  flex-wrap: wrap;
  gap: $space-5;
  margin-bottom: $space-4;
}

.profile__title {
  margin: 0 0 $space-2;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.profile__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $space-2;
  margin: 0 0 $space-4;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.profile__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: $space-3 $space-5;
  margin: 0;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }

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
  }
}

.profile__code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  letter-spacing: 0.02em;
}

.notice {
  margin-bottom: $space-4;
  padding: $space-3 $space-4;
  border-radius: $radius-md;
  background: $color-warning-light;
  color: $color-warning-hover;
  font-size: $font-size-sm;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: $space-4;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
}

.stat__label {
  margin: 0 0 $space-2;
  font-size: $font-size-xs;
  color: $color-text-muted;
}

.stat__value {
  margin: 0;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;

  &.is-debt {
    color: $color-error;
  }
}

.reviews__title {
  margin: 0 0 $space-3;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.reviews__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.reviews__item {
  padding: $space-4;
  border-radius: $radius-card;
  background: $color-bg-muted;
}

.reviews__head {
  display: flex;
  justify-content: space-between;
  gap: $space-3;
  margin-bottom: $space-1;
  font-size: $font-size-sm;
  color: $color-text-muted;

  strong {
    color: $color-text-primary;
  }
}

.reviews__subject {
  margin: 0 0 $space-2;
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  color: $color-primary;
}

.reviews__text {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}
</style>
