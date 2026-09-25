<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/core/layouts/AppLayout.vue'
import {
  BaseAvatar,
  BaseCard,
  BaseChip,
  BaseInput,
} from '@/core/components/ui'
import { TEACHERS, getGroupById, getSubjectById } from '@/modules/shared/constants/entities.js'

const router = useRouter()
const search = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return TEACHERS.filter((t) => !q || t.name.toLowerCase().includes(q))
})

function openTeacher(id) {
  router.push(`/teachers/${id}`)
}

function groupNames(teacher) {
  return teacher.groupIds
    .map((id) => getGroupById(id)?.name)
    .filter(Boolean)
    .join(', ') || '—'
}

function subjectNames(teacher) {
  return teacher.subjectIds
    .map((id) => getSubjectById(id)?.name)
    .filter(Boolean)
    .join(', ') || '—'
}
</script>

<template>
  <AppLayout
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Преподаватели' }]"
    active-route="teachers"
  >
    <div class="page">
      <header class="page__header">
        <h1 class="page__title">Преподаватели</h1>
        <p class="page__subtitle">Карточки сотрудников и статус блокировки</p>
      </header>

      <div class="page__filters">
        <BaseInput v-model="search" label="Поиск" placeholder="ФИО преподавателя" />
      </div>

      <div v-if="!filtered.length" class="page__empty">Преподаватели не найдены</div>

      <div v-else class="teachers-grid">
        <button
          v-for="teacher in filtered"
          :key="teacher.id"
          type="button"
          class="teacher-card-btn"
          @click="openTeacher(teacher.id)"
        >
          <BaseCard padding="md" class="teacher-card">
            <div class="teacher-card__head">
              <BaseAvatar :name="teacher.name" size="lg" />
              <div class="teacher-card__info">
                <div class="teacher-card__title-row">
                  <h3 class="teacher-card__name">{{ teacher.name }}</h3>
                  <BaseChip
                    v-if="teacher.blocked"
                    variant="rejected"
                    size="sm"
                  >
                    Заблокирован
                  </BaseChip>
                </div>
                <p class="teacher-card__meta">{{ teacher.email }}</p>
                <p class="teacher-card__meta">{{ teacher.phone }}</p>
              </div>
            </div>
            <dl class="teacher-card__stats">
              <div>
                <dt>Группы</dt>
                <dd>{{ groupNames(teacher) }}</dd>
              </div>
              <div>
                <dt>Предметы</dt>
                <dd>{{ subjectNames(teacher) }}</dd>
              </div>
            </dl>
          </BaseCard>
        </button>
      </div>
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

.page__filters {
  max-width: 420px;
}

.page__empty {
  padding: $space-8;
  text-align: center;
  color: $color-text-muted;
  background: $color-bg-muted;
  border-radius: $radius-card;
}

.teachers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: $space-4;
}

.teacher-card-btn {
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

.teacher-card__head {
  display: flex;
  gap: $space-4;
  margin-bottom: $space-4;
}

.teacher-card__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $space-2;
  margin-bottom: $space-1;
}

.teacher-card__name {
  margin: 0;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.teacher-card__meta {
  margin: 0 0 $space-1;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.teacher-card__stats {
  display: grid;
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
    font-weight: $font-weight-medium;
    color: $color-text-primary;
  }
}
</style>
