<script setup>
import { computed, reactive, watch } from 'vue'
import AppLayout from '@/core/layouts/AppLayout.vue'
import {
  BaseButton,
  BaseCard,
  BaseChip,
  BaseInput,
  BaseModal,
  BaseSelect,
} from '@/core/components/ui'
import { useToast } from '@/core/composables/useToast.js'
import { useConfirm } from '@/core/composables/useConfirm.js'
import {
  GROUPS,
  SUBJECTS,
  TEACHERS,
  getGroupById,
  getSubjectById,
  getTeacherById,
} from '@/modules/shared/constants/entities.js'
import {
  formatLessonDateTime,
  fromDatetimeLocalValue,
  toDatetimeLocalValue,
} from '@/modules/schedule/constants/schedule.js'
import { useSchedule } from '@/modules/schedule/composables/useSchedule.js'

const toast = useToast()
const { confirm } = useConfirm()
const {
  visibleLessons,
  showCancelled,
  modalOpen,
  editingId,
  openCreate,
  openEdit,
  closeModal,
  getById,
  saveLesson,
  cancelLesson,
  applySemesterTemplate,
} = useSchedule()

const form = reactive({
  groupId: '',
  subjectId: '',
  teacherId: '',
  datetime: '',
  room: '',
  online: false,
  link: '',
})

const groupOptions = GROUPS.map((g) => ({ value: g.id, label: g.name }))
const subjectOptions = SUBJECTS.map((s) => ({ value: s.id, label: s.name }))
const teacherOptions = TEACHERS.filter((t) => !t.blocked).map((t) => ({
  value: t.id,
  label: t.name,
}))
const modeOptions = [
  { value: 'offline', label: 'Аудитория' },
  { value: 'online', label: 'Онлайн' },
]

const isEdit = computed(() => Boolean(editingId.value))
const modalTitle = computed(() => (isEdit.value ? 'Редактировать занятие' : 'Новое занятие'))
const modeValue = computed({
  get: () => (form.online ? 'online' : 'offline'),
  set: (v) => {
    form.online = v === 'online'
  },
})

watch(modalOpen, (open) => {
  if (!open) return
  if (editingId.value) {
    const item = getById(editingId.value)
    if (!item) return
    form.groupId = item.groupId
    form.subjectId = item.subjectId
    form.teacherId = item.teacherId
    form.datetime = toDatetimeLocalValue(item.datetime)
    form.room = item.room
    form.online = item.online
    form.link = item.link
  } else {
    form.groupId = GROUPS[0]?.id || ''
    form.subjectId = SUBJECTS[0]?.id || ''
    form.teacherId = TEACHERS.find((t) => !t.blocked)?.id || ''
    form.datetime = ''
    form.room = ''
    form.online = false
    form.link = ''
  }
})

function locationLabel(lesson) {
  if (lesson.online) return lesson.link ? 'Онлайн' : 'Онлайн'
  return lesson.room ? `ауд. ${lesson.room}` : '—'
}

function onSave() {
  if (!form.groupId || !form.subjectId || !form.teacherId || !form.datetime) {
    toast.error('Заполните группу, предмет, преподавателя и дату')
    return
  }
  if (form.online && !form.link.trim()) {
    toast.error('Укажите ссылку для онлайн-занятия')
    return
  }
  if (!form.online && !form.room.trim()) {
    toast.error('Укажите аудиторию')
    return
  }

  const id = saveLesson({
    groupId: form.groupId,
    subjectId: form.subjectId,
    teacherId: form.teacherId,
    datetime: fromDatetimeLocalValue(form.datetime),
    room: form.room,
    online: form.online,
    link: form.link,
  })
  if (id) {
    toast.success(isEdit.value ? 'Занятие обновлено' : 'Занятие создано')
  }
}

async function onCancel(lesson) {
  const ok = await confirm({
    title: 'Отменить занятие?',
    message: 'Студенты и преподаватель не увидят это занятие в расписании.',
    confirmText: 'Отменить занятие',
    cancelText: 'Назад',
    variant: 'primary',
  })
  if (!ok) return
  if (cancelLesson(lesson.id)) {
    toast.success('Занятие отмечено как отменённое')
  }
}

function onSemesterTemplate(lesson) {
  const count = applySemesterTemplate(lesson.id)
  if (count) {
    toast.success(`Шаблон семестра: создано ${count} повторений`)
  } else {
    toast.error('Не удалось создать шаблон')
  }
}
</script>

<template>
  <AppLayout
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Расписание' }]"
    active-route="schedule"
  >
    <div class="schedule-view">
      <header class="schedule-view__header">
        <div>
          <h1 class="schedule-view__title">Расписание</h1>
          <p class="schedule-view__subtitle">
            Занятия по группам: аудитория или онлайн
          </p>
        </div>
        <div class="schedule-view__actions">
          <label class="schedule-view__toggle">
            <input v-model="showCancelled" type="checkbox" />
            <span>Показать отменённые</span>
          </label>
          <BaseButton variant="primary" icon="calendar-03" @click="openCreate">
            Создать занятие
          </BaseButton>
        </div>
      </header>

      <div v-if="!visibleLessons.length" class="schedule-view__empty">
        Нет занятий для отображения
      </div>

      <ul v-else class="schedule-view__list">
        <li v-for="lesson in visibleLessons" :key="lesson.id">
          <BaseCard padding="md" class="lesson-card">
            <div class="lesson-card__top">
              <div>
                <h3 class="lesson-card__title">
                  {{ getSubjectById(lesson.subjectId)?.name || 'Предмет' }}
                  ·
                  {{ getGroupById(lesson.groupId)?.name || 'Группа' }}
                </h3>
                <p class="lesson-card__meta">
                  {{ formatLessonDateTime(lesson.datetime) }}
                  ·
                  {{ locationLabel(lesson) }}
                </p>
                <p class="lesson-card__teacher">
                  {{ getTeacherById(lesson.teacherId)?.name || '—' }}
                </p>
              </div>
              <BaseChip
                v-if="lesson.cancelled"
                size="sm"
                variant="rejected"
              >
                Отменено
              </BaseChip>
              <BaseChip
                v-else-if="lesson.online"
                size="sm"
                variant="pending"
              >
                Онлайн
              </BaseChip>
            </div>

            <div v-if="!lesson.cancelled" class="lesson-card__actions">
              <BaseButton
                variant="secondary"
                size="sm"
                icon="pencil-edit-02"
                @click="openEdit(lesson.id)"
              >
                Изменить
              </BaseButton>
              <BaseButton
                variant="secondary"
                size="sm"
                icon="calendar-03"
                @click="onSemesterTemplate(lesson)"
              >
                Шаблон семестра
              </BaseButton>
              <BaseButton
                variant="link"
                size="sm"
                @click="onCancel(lesson)"
              >
                Отменить
              </BaseButton>
            </div>
          </BaseCard>
        </li>
      </ul>
    </div>

    <BaseModal
      :model-value="modalOpen"
      :title="modalTitle"
      size="lg"
      @update:model-value="(v) => (!v ? closeModal() : undefined)"
    >
      <div class="lesson-form">
        <BaseSelect v-model="form.groupId" label="Группа" :options="groupOptions" />
        <BaseSelect v-model="form.subjectId" label="Предмет" :options="subjectOptions" />
        <BaseSelect v-model="form.teacherId" label="Преподаватель" :options="teacherOptions" />
        <BaseInput
          v-model="form.datetime"
          label="Дата и время"
          type="datetime-local"
        />
        <BaseSelect v-model="modeValue" label="Формат" :options="modeOptions" />
        <BaseInput
          v-if="!form.online"
          v-model="form.room"
          label="Аудитория"
          placeholder="204"
        />
        <BaseInput
          v-else
          v-model="form.link"
          label="Ссылка"
          placeholder="https://…"
        />
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

.schedule-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-6 $space-6;
}

.schedule-view__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: $space-4;
  flex-wrap: wrap;
}

.schedule-view__title {
  margin: 0 0 $space-1;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.schedule-view__subtitle {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.schedule-view__actions {
  display: flex;
  align-items: center;
  gap: $space-4;
  flex-wrap: wrap;
}

.schedule-view__toggle {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  font-size: $font-size-sm;
  color: $color-text-secondary;
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
    accent-color: $color-primary;
  }
}

.schedule-view__empty {
  padding: $space-8;
  text-align: center;
  color: $color-text-muted;
}

.schedule-view__list {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  margin: 0;
  padding: 0;
  list-style: none;
}

.lesson-card__top {
  display: flex;
  justify-content: space-between;
  gap: $space-3;
  align-items: flex-start;
}

.lesson-card__title {
  margin: 0 0 $space-1;
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.lesson-card__meta,
.lesson-card__teacher {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.lesson-card__teacher {
  margin-top: $space-1;
}

.lesson-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2;
  margin-top: $space-4;
}

.lesson-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-4;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}
</style>
