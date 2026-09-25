<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/core/layouts/AppLayout.vue'
import {
  BaseAvatar,
  BaseButton,
  BaseCard,
  BaseChip,
  BaseIcon,
  BaseModal,
} from '@/core/components/ui'
import { useToast } from '@/core/composables/useToast.js'
import {
  GROUPS,
  SUBJECTS,
  getTeacherById,
} from '@/modules/shared/constants/entities.js'
import {
  TEACHER_KPI_LABELS,
  formatKpiValue,
} from '@/modules/teachers/constants/teachers.js'

const route = useRoute()
const toast = useToast()

const teacher = computed(() => getTeacherById(route.params.id))

const assignOpen = ref(false)
const selectedGroups = ref([])
const selectedSubjects = ref([])

watch(
  teacher,
  (value) => {
    if (!value) return
    selectedGroups.value = [...value.groupIds]
    selectedSubjects.value = [...value.subjectIds]
  },
  { immediate: true },
)

const kpiTiles = computed(() => {
  if (!teacher.value) return []
  return TEACHER_KPI_LABELS.map((item) => ({
    ...item,
    value: teacher.value.kpis[item.key] ?? 0,
  }))
})

function toggleId(listRef, id) {
  const idx = listRef.value.indexOf(id)
  if (idx >= 0) listRef.value.splice(idx, 1)
  else listRef.value.push(id)
}

function openAssign() {
  if (!teacher.value) return
  selectedGroups.value = [...teacher.value.groupIds]
  selectedSubjects.value = [...teacher.value.subjectIds]
  assignOpen.value = true
}

function saveAssign() {
  if (!teacher.value) return
  teacher.value.groupIds = [...selectedGroups.value]
  teacher.value.subjectIds = [...selectedSubjects.value]
  teacher.value.kpis.groups = teacher.value.groupIds.length
  assignOpen.value = false
  toast.success('Назначения обновлены')
}

function resetPassword() {
  if (!teacher.value) return
  toast.success(`Новый пароль отправлен на ${teacher.value.email}`)
}

function toggleBlock() {
  if (!teacher.value) return
  teacher.value.blocked = !teacher.value.blocked
  toast.success(teacher.value.blocked ? 'Аккаунт заблокирован' : 'Аккаунт разблокирован')
}
</script>

<template>
  <AppLayout
    :breadcrumbs="[
      { label: 'Главная', href: '/' },
      { label: 'Преподаватели', href: '/teachers' },
      { label: teacher?.name || 'Преподаватель' },
    ]"
    active-route="teachers"
  >
    <div class="page">
      <div v-if="!teacher" class="page__empty">
        Преподаватель не найден
        <BaseButton variant="secondary" as="a" href="/teachers">К списку</BaseButton>
      </div>

      <template v-else>
        <BaseCard padding="md">
          <div class="profile">
            <BaseAvatar :name="teacher.name" size="xl" />
            <div class="profile__info">
              <div class="profile__title-row">
                <h1 class="profile__title">{{ teacher.name }}</h1>
                <BaseChip v-if="teacher.blocked" variant="rejected" size="sm">
                  Заблокирован
                </BaseChip>
              </div>
              <p class="profile__meta">{{ teacher.email }} · {{ teacher.phone }}</p>
            </div>
          </div>

          <div class="actions">
            <BaseButton variant="secondary" icon="user-group" @click="openAssign">
              Назначить
            </BaseButton>
            <BaseButton variant="secondary" @click="resetPassword">
              Сбросить пароль
            </BaseButton>
            <BaseButton
              :variant="teacher.blocked ? 'primary' : 'secondary'"
              @click="toggleBlock"
            >
              {{ teacher.blocked ? 'Разблокировать' : 'Заблокировать' }}
            </BaseButton>
          </div>
        </BaseCard>

        <section class="kpis" aria-label="Показатели досье">
          <header class="kpis__header">
            <h2 class="kpis__title">Досье</h2>
            <p class="kpis__hint">Только просмотр</p>
          </header>
          <div class="kpis__grid">
            <div v-for="kpi in kpiTiles" :key="kpi.key" class="kpi-tile">
              <span class="kpi-tile__icon" aria-hidden="true">
                <BaseIcon :name="kpi.icon" :size="20" />
              </span>
              <span class="kpi-tile__label">{{ kpi.label }}</span>
              <span class="kpi-tile__value">
                {{ formatKpiValue(kpi.key, kpi.value) }}{{ kpi.unit }}
              </span>
            </div>
          </div>
        </section>
      </template>
    </div>

    <BaseModal v-model="assignOpen" title="Назначение групп и предметов" size="md">
      <div class="assign">
        <div>
          <p class="assign__label">Группы</p>
          <div class="assign__chips">
            <BaseChip
              v-for="group in GROUPS"
              :key="group.id"
              mode="filter"
              :active="selectedGroups.includes(group.id)"
              @click="toggleId(selectedGroups, group.id)"
            >
              {{ group.name }}
            </BaseChip>
          </div>
        </div>
        <div>
          <p class="assign__label">Предметы</p>
          <div class="assign__chips">
            <BaseChip
              v-for="subject in SUBJECTS"
              :key="subject.id"
              mode="filter"
              :active="selectedSubjects.includes(subject.id)"
              @click="toggleId(selectedSubjects, subject.id)"
            >
              {{ subject.name }}
            </BaseChip>
          </div>
        </div>
      </div>
      <template #footer>
        <BaseButton variant="secondary" @click="assignOpen = false">Отмена</BaseButton>
        <BaseButton variant="primary" @click="saveAssign">Сохранить</BaseButton>
      </template>
    </BaseModal>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

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

.profile {
  display: flex;
  flex-wrap: wrap;
  gap: $space-5;
  margin-bottom: $space-4;
}

.profile__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $space-2;
  margin-bottom: $space-2;
}

.profile__title {
  margin: 0;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.profile__meta {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2;
}

.kpis__header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: $space-2 $space-4;
  margin-bottom: $space-4;
}

.kpis__title {
  margin: 0;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.kpis__hint {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-muted;
}

.kpis__grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: $space-4;

  @include media-tablet-down {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @include media-phone {
    grid-template-columns: 1fr;
  }
}

.kpi-tile {
  @include card-surface;

  display: flex;
  flex-direction: column;
  gap: $space-2;
  padding: $space-4;
  min-height: 120px;
  pointer-events: none;
}

.kpi-tile__icon {
  @include flex-center;

  width: 36px;
  height: 36px;
  border-radius: $radius-md;
  background: $color-primary-light;
  color: $color-primary;
}

.kpi-tile__label {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.kpi-tile__value {
  margin-top: auto;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.assign {
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

.assign__label {
  margin: 0 0 $space-2;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.assign__chips {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2;
}
</style>
