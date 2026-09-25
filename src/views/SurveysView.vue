<script setup>
import { useRouter } from 'vue-router'
import AppLayout from '@/core/layouts/AppLayout.vue'
import {
  BaseButton,
  BaseCard,
  BaseChip,
} from '@/core/components/ui'
import { useToast } from '@/core/composables/useToast.js'
import { useConfirm } from '@/core/composables/useConfirm.js'
import {
  SURVEY_STATUS,
  SURVEY_STATUS_LABELS,
} from '@/modules/surveys/constants/surveys.js'
import { useSurveys } from '@/modules/surveys/composables/useSurveys.js'

const router = useRouter()
const toast = useToast()
const { confirm } = useConfirm()
const { list, closeSurvey, canEdit } = useSurveys()

function statusVariant(status) {
  return status === SURVEY_STATUS.ACTIVE ? 'approved' : 'rejected'
}

async function onClose(survey) {
  const ok = await confirm({
    title: 'Закрыть опрос?',
    message: `«${survey.title}» перестанет принимать ответы.`,
    confirmText: 'Закрыть',
    cancelText: 'Назад',
  })
  if (!ok) return
  if (closeSurvey(survey.id)) {
    toast.success('Опрос закрыт')
  }
}

function goResults(id) {
  router.push(`/surveys/${id}/results`)
}

function goEdit(id) {
  router.push({ path: '/surveys/new', query: { edit: id } })
}

function goCreate() {
  router.push('/surveys/new')
}
</script>

<template>
  <AppLayout
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Опросы' }]"
    active-route="surveys"
  >
    <div class="surveys-view">
      <header class="surveys-view__header">
        <div>
          <h1 class="surveys-view__title">Опросы</h1>
          <p class="surveys-view__subtitle">
            Список, закрытие и переход к результатам
          </p>
        </div>
        <BaseButton variant="primary" icon="pencil-edit-02" @click="goCreate">
          Создать опрос
        </BaseButton>
      </header>

      <div v-if="!list.length" class="surveys-view__empty">
        Опросов пока нет
      </div>

      <ul v-else class="surveys-view__list">
        <li v-for="survey in list" :key="survey.id">
          <BaseCard padding="md" class="survey-card">
            <div class="survey-card__top">
              <div>
                <h3 class="survey-card__title">{{ survey.title }}</h3>
                <p class="survey-card__meta">
                  Ответов: {{ survey.answersCount }}
                  ·
                  Вопросов: {{ survey.questions.length }}
                </p>
              </div>
              <BaseChip size="sm" :variant="statusVariant(survey.status)">
                {{ SURVEY_STATUS_LABELS[survey.status] }}
              </BaseChip>
            </div>

            <div class="survey-card__actions">
              <BaseButton
                variant="secondary"
                size="sm"
                icon="chart-bar"
                @click="goResults(survey.id)"
              >
                Результаты
              </BaseButton>
              <BaseButton
                v-if="canEdit(survey.id)"
                variant="secondary"
                size="sm"
                icon="pencil-edit-02"
                @click="goEdit(survey.id)"
              >
                Редактировать
              </BaseButton>
              <BaseButton
                v-if="survey.status === SURVEY_STATUS.ACTIVE"
                variant="link"
                size="sm"
                @click="onClose(survey)"
              >
                Закрыть
              </BaseButton>
            </div>
          </BaseCard>
        </li>
      </ul>
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.surveys-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-6 $space-6;
}

.surveys-view__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: $space-4;
  flex-wrap: wrap;
}

.surveys-view__title {
  margin: 0 0 $space-1;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.surveys-view__subtitle {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.surveys-view__empty {
  padding: $space-8;
  text-align: center;
  color: $color-text-muted;
}

.surveys-view__list {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  margin: 0;
  padding: 0;
  list-style: none;
}

.survey-card__top {
  display: flex;
  justify-content: space-between;
  gap: $space-3;
  align-items: flex-start;
}

.survey-card__title {
  margin: 0 0 $space-1;
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.survey-card__meta {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.survey-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2;
  margin-top: $space-4;
}
</style>
