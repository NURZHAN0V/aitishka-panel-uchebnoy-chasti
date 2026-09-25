<script setup>
import AppLayout from '@/core/layouts/AppLayout.vue'
import {
  BaseButton,
  BaseCard,
  BaseIcon,
  BaseInput,
  BaseModal,
} from '@/core/components/ui'
import { useToast } from '@/core/composables/useToast.js'
import { useModerationPhotos } from '@/modules/moderation/composables/useModeration.js'

const toast = useToast()
const {
  queue,
  rejectOpen,
  rejectReason,
  approve,
  openReject,
  closeReject,
  confirmReject,
} = useModerationPhotos()

function onApprove(item) {
  if (approve(item.id)) {
    toast.success(`Фото «${item.studentName}» одобрено`)
  }
}

function onConfirmReject() {
  if (!rejectReason.value.trim()) {
    toast.error('Укажите причину отклонения')
    return
  }
  if (confirmReject()) {
    toast.success('Фото отклонено')
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <AppLayout
    :breadcrumbs="[
      { label: 'Главная', href: '/' },
      { label: 'Модерация' },
      { label: 'Фото' },
    ]"
    active-route="moderation-photos"
  >
    <div class="moderation-view">
      <header class="moderation-view__header">
        <div>
          <h1 class="moderation-view__title">Модерация фото</h1>
          <p class="moderation-view__subtitle">
            Очередь загрузок профилей студентов
          </p>
        </div>
      </header>

      <div v-if="!queue.length" class="moderation-view__empty">
        Очередь пуста
      </div>

      <ul v-else class="moderation-view__list">
        <li v-for="item in queue" :key="item.id">
          <BaseCard padding="md" class="photo-card">
            <div class="photo-card__preview" aria-hidden="true">
              <BaseIcon name="image-01" :size="36" />
              <span>{{ item.previewLabel }}</span>
            </div>
            <div class="photo-card__info">
              <h3 class="photo-card__name">{{ item.studentName }}</h3>
              <p class="photo-card__meta">Загружено {{ formatDate(item.submittedAt) }}</p>
              <div class="photo-card__actions">
                <BaseButton variant="primary" size="sm" icon="check-circle" @click="onApprove(item)">
                  Одобрить
                </BaseButton>
                <BaseButton variant="secondary" size="sm" icon="x-close" @click="openReject(item.id)">
                  Отклонить
                </BaseButton>
              </div>
            </div>
          </BaseCard>
        </li>
      </ul>
    </div>

    <BaseModal
      :model-value="rejectOpen"
      title="Отклонить фото"
      size="md"
      @update:model-value="(v) => (!v ? closeReject() : undefined)"
    >
      <BaseInput
        v-model="rejectReason"
        label="Причина"
        placeholder="Причина будет видна студенту"
      />
      <template #footer>
        <BaseButton variant="secondary" @click="closeReject">Отмена</BaseButton>
        <BaseButton variant="primary" @click="onConfirmReject">Отклонить</BaseButton>
      </template>
    </BaseModal>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.moderation-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-6 $space-6;
}

.moderation-view__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: $space-4;
}

.moderation-view__title {
  margin: 0 0 $space-1;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.moderation-view__subtitle {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.moderation-view__empty {
  padding: $space-8;
  text-align: center;
  color: $color-text-muted;
}

.moderation-view__list {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  margin: 0;
  padding: 0;
  list-style: none;
}

.photo-card {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: $space-4;
  align-items: stretch;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
}

.photo-card__preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  min-height: 120px;
  border-radius: $radius-lg;
  background: $color-bg-muted;
  color: $color-text-muted;
  font-size: $font-size-xs;
  text-align: center;
  padding: $space-3;
  word-break: break-all;
}

.photo-card__info {
  display: flex;
  flex-direction: column;
  gap: $space-2;
  justify-content: center;
}

.photo-card__name {
  margin: 0;
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.photo-card__meta {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.photo-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2;
  margin-top: $space-2;
}
</style>
