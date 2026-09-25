<script setup>
import { computed, reactive, watch } from 'vue'
import AppLayout from '@/core/layouts/AppLayout.vue'
import {
  BaseButton,
  BaseCard,
  BaseChip,
  BaseIcon,
  BaseInput,
  BaseModal,
} from '@/core/components/ui'
import { useToast } from '@/core/composables/useToast.js'
import { GROUPS, TEACHERS } from '@/modules/shared/constants/entities.js'
import { useSubjects } from '@/modules/subjects/composables/useSubjects.js'

const toast = useToast()
const {
  list,
  modalOpen,
  editingId,
  openCreate,
  openEdit,
  closeModal,
  getById,
  saveSubject,
} = useSubjects()

const form = reactive({
  name: '',
  cover: '',
  groupIds: [],
  teacherIds: [],
})

const isEdit = computed(() => Boolean(editingId.value))
const modalTitle = computed(() => (isEdit.value ? 'Редактировать предмет' : 'Новый предмет'))

const activeTeachers = computed(() => TEACHERS.filter((t) => !t.blocked))

watch(modalOpen, (open) => {
  if (!open) return
  if (editingId.value) {
    const item = getById(editingId.value)
    if (!item) return
    form.name = item.name
    form.cover = item.cover
    form.groupIds = [...item.groupIds]
    form.teacherIds = [...item.teacherIds]
  } else {
    form.name = ''
    form.cover = ''
    form.groupIds = []
    form.teacherIds = []
  }
})

function toggleId(listRef, id) {
  const idx = listRef.indexOf(id)
  if (idx === -1) listRef.push(id)
  else listRef.splice(idx, 1)
}

function onSave() {
  if (!form.name.trim()) {
    toast.error('Укажите название предмета')
    return
  }
  const id = saveSubject({
    name: form.name,
    cover: form.cover,
    groupIds: form.groupIds,
    teacherIds: form.teacherIds,
  })
  if (id) {
    toast.success(isEdit.value ? 'Предмет обновлён' : 'Предмет создан')
  }
}
</script>

<template>
  <AppLayout
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Предметы' }]"
    active-route="subjects"
  >
    <div class="subjects-view">
      <header class="subjects-view__header">
        <div>
          <h1 class="subjects-view__title">Предметы</h1>
          <p class="subjects-view__subtitle">
            Обложки, привязка групп и назначение преподавателей
          </p>
        </div>
        <BaseButton variant="primary" icon="book-open-01" @click="openCreate">
          Создать предмет
        </BaseButton>
      </header>

      <div v-if="!list.length" class="subjects-view__empty">
        Предметы ещё не созданы
      </div>

      <div v-else class="subjects-view__grid">
        <BaseCard
          v-for="subject in list"
          :key="subject.id"
          padding="md"
          class="subject-card"
        >
          <div class="subject-card__cover" aria-hidden="true">
            <BaseIcon name="image-01" :size="32" />
            <span>{{ subject.cover ? 'Обложка' : 'Нет обложки' }}</span>
          </div>
          <div class="subject-card__body">
            <h3 class="subject-card__name">{{ subject.name }}</h3>
            <div class="subject-card__meta">
              <BaseChip size="sm" variant="current">
                Групп: {{ subject.groupIds.length }}
              </BaseChip>
              <BaseChip size="sm" variant="pending">
                Преподавателей: {{ subject.teacherIds.length }}
              </BaseChip>
            </div>
            <BaseButton
              variant="secondary"
              size="sm"
              icon="pencil-edit-02"
              @click="openEdit(subject.id)"
            >
              Редактировать
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>

    <BaseModal
      :model-value="modalOpen"
      :title="modalTitle"
      size="lg"
      @update:model-value="(v) => (!v ? closeModal() : undefined)"
    >
      <div class="subject-form">
        <BaseInput
          v-model="form.name"
          label="Название"
          placeholder="Например, Python"
        />
        <BaseInput
          v-model="form.cover"
          label="Обложка"
          placeholder="Заглушка имени файла (например, python.jpg)"
          hint="В MVP загружается только название файла"
        />

        <fieldset class="subject-form__set">
          <legend>Группы</legend>
          <div class="subject-form__chips">
            <BaseChip
              v-for="group in GROUPS"
              :key="group.id"
              mode="filter"
              toned
              :active="form.groupIds.includes(group.id)"
              @click="toggleId(form.groupIds, group.id)"
            >
              {{ group.name }}
            </BaseChip>
          </div>
        </fieldset>

        <fieldset class="subject-form__set">
          <legend>Преподаватели</legend>
          <div class="subject-form__chips">
            <BaseChip
              v-for="teacher in activeTeachers"
              :key="teacher.id"
              mode="filter"
              toned
              :active="form.teacherIds.includes(teacher.id)"
              @click="toggleId(form.teacherIds, teacher.id)"
            >
              {{ teacher.name }}
            </BaseChip>
          </div>
        </fieldset>
      </div>

      <template #footer>
        <BaseButton variant="secondary" @click="closeModal">Отмена</BaseButton>
        <BaseButton variant="primary" @click="onSave">Сохранить</BaseButton>
      </template>
    </BaseModal>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.subjects-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-6 $space-6;
}

.subjects-view__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: $space-4;
  flex-wrap: wrap;
}

.subjects-view__title {
  margin: 0 0 $space-1;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.subjects-view__subtitle {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.subjects-view__empty {
  padding: $space-8;
  text-align: center;
  color: $color-text-muted;
}

.subjects-view__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: $space-4;
}

.subject-card {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.subject-card__cover {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  min-height: 120px;
  border-radius: $radius-lg;
  background: $color-bg-muted;
  color: $color-text-muted;
  font-size: $font-size-sm;
}

.subject-card__body {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.subject-card__name {
  margin: 0;
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.subject-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2;
}

.subject-form {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.subject-form__set {
  margin: 0;
  padding: 0;
  border: none;

  legend {
    margin-bottom: $space-2;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }
}

.subject-form__chips {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2;
}
</style>
