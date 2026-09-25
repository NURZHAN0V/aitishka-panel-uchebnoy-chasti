<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/core/layouts/AppLayout.vue'
import {
  BaseButton,
  BaseCard,
  BaseInput,
  BaseModal,
  BaseSelect,
} from '@/core/components/ui'
import { useToast } from '@/core/composables/useToast.js'
import { GROUPS } from '@/modules/shared/constants/entities.js'
import {
  AGE_BAND_OPTIONS,
  YEAR_OPTIONS,
} from '@/modules/groups/constants/groups.js'

const router = useRouter()
const toast = useToast()

const modalOpen = ref(false)
const editingId = ref(null)
const form = reactive({
  name: '',
  ageBand: '9–14',
  year: '2025/26',
})

function openCreate() {
  editingId.value = null
  form.name = ''
  form.ageBand = '9–14'
  form.year = '2025/26'
  modalOpen.value = true
}

function openEdit(group, event) {
  event.stopPropagation()
  editingId.value = group.id
  form.name = group.name
  form.ageBand = group.ageBand
  form.year = group.year
  modalOpen.value = true
}

function submitForm() {
  if (!form.name.trim()) {
    toast.error('Укажите название группы')
    return
  }

  if (editingId.value) {
    const group = GROUPS.find((g) => g.id === editingId.value)
    if (group) {
      group.name = form.name.trim()
      group.ageBand = form.ageBand
      group.year = form.year
    }
    toast.success('Группа обновлена')
  } else {
    const id = `g-${Date.now()}`
    GROUPS.push({
      id,
      name: form.name.trim(),
      ageBand: form.ageBand,
      year: form.year,
      subjectIds: [],
      teacherIds: [],
    })
    toast.success('Группа создана')
  }

  modalOpen.value = false
}

function openGroup(id) {
  router.push(`/groups/${id}`)
}
</script>

<template>
  <AppLayout
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Группы' }]"
    active-route="groups"
  >
    <div class="page">
      <header class="page__header">
        <div>
          <h1 class="page__title">Группы</h1>
          <p class="page__subtitle">Возрастная категория и учебный год</p>
        </div>
        <BaseButton variant="primary" icon="user-group" @click="openCreate">
          Создать группу
        </BaseButton>
      </header>

      <div v-if="!GROUPS.length" class="page__empty">Групп пока нет</div>

      <div v-else class="groups-grid">
        <BaseCard
          v-for="group in GROUPS"
          :key="group.id"
          padding="md"
          class="group-card"
          role="button"
          tabindex="0"
          @click="openGroup(group.id)"
          @keydown.enter="openGroup(group.id)"
        >
          <div class="group-card__head">
            <div>
              <h3 class="group-card__name">{{ group.name }}</h3>
              <p class="group-card__meta">
                {{ group.ageBand }} · {{ group.year }}
              </p>
            </div>
            <BaseButton
              variant="secondary"
              size="sm"
              icon="pencil-edit-02"
              @click="openEdit(group, $event)"
            >
              Изменить
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>

    <BaseModal
      v-model="modalOpen"
      :title="editingId ? 'Редактировать группу' : 'Новая группа'"
      size="sm"
    >
      <div class="form-grid">
        <BaseInput v-model="form.name" label="Название" placeholder="Python-3" />
        <BaseSelect
          v-model="form.ageBand"
          label="Возраст"
          :options="AGE_BAND_OPTIONS"
        />
        <BaseSelect
          v-model="form.year"
          label="Учебный год"
          :options="YEAR_OPTIONS"
        />
      </div>
      <template #footer>
        <BaseButton variant="secondary" @click="modalOpen = false">Отмена</BaseButton>
        <BaseButton variant="primary" @click="submitForm">
          {{ editingId ? 'Сохранить' : 'Создать' }}
        </BaseButton>
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

.page__empty {
  padding: $space-8;
  text-align: center;
  color: $color-text-muted;
  background: $color-bg-muted;
  border-radius: $radius-card;
}

.groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: $space-4;
}

.group-card {
  cursor: pointer;
  transition: transform $transition-fast;

  &:hover {
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }
}

.group-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: $space-3;
}

.group-card__name {
  margin: 0 0 $space-1;
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.group-card__meta {
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
