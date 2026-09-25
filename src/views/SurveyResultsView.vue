<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/core/layouts/AppLayout.vue'
import {
  BaseButton,
  BaseCard,
  BaseTabs,
} from '@/core/components/ui'
import {
  RESULT_TABS,
  SURVEY_STATUS_LABELS,
} from '@/modules/surveys/constants/surveys.js'
import { useSurveys } from '@/modules/surveys/composables/useSurveys.js'

const route = useRoute()
const router = useRouter()
const { getById } = useSurveys()

const tab = ref('answered')

const survey = computed(() => getById(route.params.id))

const names = computed(() => {
  if (!survey.value) return []
  const key = tab.value
  return survey.value.results?.[key] || []
})

const counts = computed(() => {
  if (!survey.value) {
    return { answered: 0, declined: 0, no_answer: 0 }
  }
  const r = survey.value.results
  return {
    answered: r.answered.length,
    declined: r.declined.length,
    no_answer: r.no_answer.length,
  }
})

const tabsWithCounts = computed(() =>
  RESULT_TABS.map((t) => ({
    ...t,
    label: `${t.label} (${counts.value[t.id] ?? 0})`,
  })),
)
</script>

<template>
  <AppLayout
    :breadcrumbs="[
      { label: 'Главная', href: '/' },
      { label: 'Опросы', href: '/surveys' },
      { label: 'Результаты' },
    ]"
    active-route="surveys"
  >
    <div class="survey-results">
      <header class="survey-results__header">
        <div>
          <h1 class="survey-results__title">
            {{ survey?.title || 'Результаты опроса' }}
          </h1>
          <p v-if="survey" class="survey-results__subtitle">
            Статус: {{ SURVEY_STATUS_LABELS[survey.status] }}
            ·
            Ответов: {{ survey.answersCount }}
          </p>
        </div>
        <BaseButton variant="secondary" @click="router.push('/surveys')">
          К списку
        </BaseButton>
      </header>

      <BaseCard v-if="!survey" padding="md">
        <p class="survey-results__empty">Опрос не найден</p>
      </BaseCard>

      <template v-else>
        <BaseCard v-if="survey.questions.length" padding="md">
          <template #title>Вопросы</template>
          <ol class="survey-results__questions">
            <li v-for="(q, i) in survey.questions" :key="i">{{ q }}</li>
          </ol>
        </BaseCard>

        <BaseTabs v-model="tab" :tabs="tabsWithCounts" size="sm" />

        <BaseCard padding="md">
          <ul v-if="names.length" class="survey-results__names">
            <li v-for="name in names" :key="name">{{ name }}</li>
          </ul>
          <p v-else class="survey-results__empty">В этой категории никого нет</p>
        </BaseCard>
      </template>
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.survey-results {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-6 $space-6;
}

.survey-results__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: $space-4;
  flex-wrap: wrap;
}

.survey-results__title {
  margin: 0 0 $space-1;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.survey-results__subtitle {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.survey-results__questions {
  margin: 0;
  padding-left: $space-5;
  color: $color-text-primary;
  font-size: $font-size-sm;
  line-height: 1.5;
}

.survey-results__names {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: $space-2;

  li {
    padding: $space-3 $space-4;
    border-radius: $radius-md;
    background: $color-bg-muted;
    font-size: $font-size-sm;
    color: $color-text-primary;
  }
}

.survey-results__empty {
  margin: 0;
  text-align: center;
  color: $color-text-muted;
  font-size: $font-size-sm;
}
</style>
