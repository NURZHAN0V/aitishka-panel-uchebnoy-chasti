<script setup>
import { ref } from 'vue'
import AppLayout from '@/core/layouts/AppLayout.vue'
import {
  BaseButton,
  BaseCard,
  BaseFileUpload,
  BaseIcon,
  BaseInput,
  BaseModal,
} from '@/core/components/ui'
import { useToast } from '@/core/composables/useToast.js'
import { useModerationYandex } from '@/modules/moderation/composables/useModeration.js'

const toast = useToast()
const {
  queue,
  tutorialName,
  rejectOpen,
  rejectReason,
  verify,
  openReject,
  closeReject,
  confirmReject,
  setTutorialVideo,
  YANDEX_COINS_REWARD,
} = useModerationYandex()

const uploadError = ref('')

function onVerify(item) {
  const result = verify(item.id)
  if (!result.ok) return
  if (result.coins > 0) {
    toast.success(`Отзыв подтверждён, +${result.coins} коинов`)
  } else {
    toast.info('Отзыв подтверждён. Коины уже начислялись ранее')
  }
}

function onConfirmReject() {
  if (!rejectReason.value.trim()) {
    toast.error('Укажите причину отклонения')
    return
  }
  if (confirmReject()) {
    toast.success('Отзыв отклонён')
  }
}

function onVideoUpdate(file) {
  uploadError.value = ''
  if (setTutorialVideo(file)) {
    toast.success('Обучающее видео обновлено')
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
      { label: 'Отзывы Яндекс' },
    ]"
    active-route="moderation-yandex"
  >
    <div class="moderation-view">
      <header class="moderation-view__header">
        <div>
          <h1 class="moderation-view__title">Отзывы Яндекс</h1>
          <p class="moderation-view__subtitle">
            Проверка ссылок и начисление {{ YANDEX_COINS_REWARD }} коинов один раз
          </p>
        </div>
      </header>

      <BaseCard padding="md" class="tutorial-card">
        <template #title>Обучающее видео</template>
        <p class="tutorial-card__current">
          Текущий файл: <strong>{{ tutorialName }}</strong>
        </p>
        <BaseFileUpload
          accept="video/*"
          :max-size="50 * 1024 * 1024"
          @update:model-value="onVideoUpdate"
          @error="uploadError = $event"
        />
        <p v-if="uploadError" class="tutorial-card__error">{{ uploadError }}</p>
      </BaseCard>

      <div v-if="!queue.length" class="moderation-view__empty">
        Очередь пуста
      </div>

      <ul v-else class="moderation-view__list">
        <li v-for="item in queue" :key="item.id">
          <BaseCard padding="md" class="yandex-card">
            <div class="yandex-card__icon" aria-hidden="true">
              <BaseIcon name="star" :size="28" />
            </div>
            <div class="yandex-card__info">
              <h3 class="yandex-card__name">{{ item.studentName }}</h3>
              <p class="yandex-card__link">{{ item.linkStub }}</p>
              <p class="yandex-card__meta">Отправлено {{ formatDate(item.submittedAt) }}</p>
              <div class="yandex-card__actions">
                <BaseButton
                  variant="primary"
                  size="sm"
                  icon="checkmark-badge-01"
                  @click="onVerify(item)"
                >
                  Проверить (+{{ YANDEX_COINS_REWARD }})
                </BaseButton>
                <BaseButton
                  variant="secondary"
                  size="sm"
                  icon="x-close"
                  @click="openReject(item.id)"
                >
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
      title="Отклонить отзыв"
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

.tutorial-card__current {
  margin: 0 0 $space-4;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.tutorial-card__error {
  margin: $space-2 0 0;
  font-size: $font-size-sm;
  color: $color-error;
}

.yandex-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: $space-4;
  align-items: start;
}

.yandex-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: $radius-lg;
  background: $color-primary-light;
  color: $color-primary;
}

.yandex-card__name {
  margin: 0 0 $space-1;
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.yandex-card__link {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-primary;
  word-break: break-all;
}

.yandex-card__meta {
  margin: $space-1 0 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.yandex-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2;
  margin-top: $space-3;
}
</style>
