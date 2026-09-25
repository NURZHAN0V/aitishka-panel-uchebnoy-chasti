<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/core/layouts/AppLayout.vue'
import {
  BaseAvatar,
  BaseButton,
  BaseCard,
  BaseChip,
} from '@/core/components/ui'
import {
  STATUS_LABELS,
  getGroupById,
  getStudentsByGroup,
  getSubjectById,
  getTeacherById,
} from '@/modules/shared/constants/entities.js'
import { getGroupRating } from '@/modules/groups/constants/groups.js'

const route = useRoute()
const router = useRouter()

const group = computed(() => getGroupById(route.params.id))
const students = computed(() => (group.value ? getStudentsByGroup(group.value.id) : []))
const teachers = computed(() =>
  group.value
    ? group.value.teacherIds.map((id) => getTeacherById(id)).filter(Boolean)
    : [],
)
const subjects = computed(() =>
  group.value
    ? group.value.subjectIds.map((id) => getSubjectById(id)).filter(Boolean)
    : [],
)
const rating = computed(() => (group.value ? getGroupRating(group.value.id) : []))

function statusVariant(status) {
  if (status === 'active') return 'approved'
  if (status === 'transferred') return 'pending'
  return 'rejected'
}

function openStudent(id) {
  router.push(`/students/${id}`)
}

function openTeacher(id) {
  router.push(`/teachers/${id}`)
}
</script>

<template>
  <AppLayout
    :breadcrumbs="[
      { label: 'Главная', href: '/' },
      { label: 'Группы', href: '/groups' },
      { label: group?.name || 'Группа' },
    ]"
    active-route="groups"
  >
    <div class="page">
      <div v-if="!group" class="page__empty">
        Группа не найдена
        <BaseButton variant="secondary" as="a" href="/groups">К списку</BaseButton>
      </div>

      <template v-else>
        <BaseCard padding="md">
          <h1 class="page__title">{{ group.name }}</h1>
          <p class="page__subtitle">
            Возраст {{ group.ageBand }} · Учебный год {{ group.year }}
          </p>
        </BaseCard>

        <section class="section">
          <h2 class="section__title">Студенты</h2>
          <div v-if="!students.length" class="page__empty-block">Нет студентов</div>
          <ul v-else class="people-list">
            <li
              v-for="student in students"
              :key="student.id"
              class="people-list__item"
              role="button"
              tabindex="0"
              @click="openStudent(student.id)"
              @keydown.enter="openStudent(student.id)"
            >
              <BaseAvatar :name="student.name" size="md" />
              <div class="people-list__info">
                <strong>{{ student.name }}</strong>
                <BaseChip :variant="statusVariant(student.status)" size="sm">
                  {{ STATUS_LABELS[student.status] }}
                </BaseChip>
              </div>
            </li>
          </ul>
        </section>

        <section class="section">
          <h2 class="section__title">Преподаватели</h2>
          <div v-if="!teachers.length" class="page__empty-block">Нет преподавателей</div>
          <ul v-else class="people-list">
            <li
              v-for="teacher in teachers"
              :key="teacher.id"
              class="people-list__item"
              role="button"
              tabindex="0"
              @click="openTeacher(teacher.id)"
              @keydown.enter="openTeacher(teacher.id)"
            >
              <BaseAvatar :name="teacher.name" size="md" />
              <div class="people-list__info">
                <strong>{{ teacher.name }}</strong>
                <span class="people-list__meta">{{ teacher.email }}</span>
              </div>
            </li>
          </ul>
        </section>

        <section class="section">
          <h2 class="section__title">Предметы</h2>
          <div v-if="!subjects.length" class="page__empty-block">Нет предметов</div>
          <div v-else class="subject-chips">
            <BaseChip v-for="subject in subjects" :key="subject.id" toned>
              {{ subject.name }}
            </BaseChip>
          </div>
        </section>

        <section class="section">
          <header class="section__header">
            <h2 class="section__title">Рейтинг группы</h2>
            <p class="section__hint">За календарный месяц · только просмотр</p>
          </header>
          <div v-if="!rating.length" class="page__empty-block">Нет данных рейтинга</div>
          <div v-else class="rating-table-wrap">
            <table class="rating-table">
              <thead>
                <tr>
                  <th>Место</th>
                  <th>ФИО</th>
                  <th>Балл</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in rating" :key="row.place">
                  <td>{{ row.place }}</td>
                  <td>{{ row.name }}</td>
                  <td>{{ row.score }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>
    </div>
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

.section__header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: $space-2 $space-4;
  margin-bottom: $space-3;
}

.section__title {
  margin: 0 0 $space-3;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.section__header .section__title {
  margin-bottom: 0;
}

.section__hint {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-muted;
}

.people-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.people-list__item {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-3 $space-4;
  border-radius: $radius-card;
  background: $color-bg-muted;
  cursor: pointer;

  &:hover {
    background: $color-primary-light;
  }

  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }
}

.people-list__info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $space-2;
  min-width: 0;

  strong {
    color: $color-text-primary;
  }
}

.people-list__meta {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.subject-chips {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2;
}

.rating-table-wrap {
  overflow-x: auto;
  border-radius: $radius-card;
  border: 1px solid $color-border-light;
}

.rating-table {
  width: 100%;
  border-collapse: collapse;
  font-size: $font-size-sm;

  th,
  td {
    padding: $space-3 $space-4;
    text-align: left;
    border-bottom: 1px solid $color-border-light;
  }

  th {
    background: $color-bg-muted;
    font-weight: $font-weight-semibold;
    color: $color-text-secondary;
  }

  td {
    color: $color-text-primary;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
}
</style>
