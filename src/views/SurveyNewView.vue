<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/core/layouts/AppLayout.vue'
import {
  BaseButton,
  BaseCard,
  BaseChip,
  BaseInput,
} from '@/core/components/ui'
import { useToast } from '@/core/composables/useToast.js'
import { useSurveys } from '@/modules/surveys/composables/useSurveys.js'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { getById, createSurvey, updateSurvey, canEdit } = useSurveys()

const editId = computed(() => (typeof route.query.edit === 'string' ? route.query.edit : ''))
const isEdit = computed(() => Boolean(editId.value))

const title = ref('')
const questions = ref([''])
const modalOnCreate = ref(true)
const loadError = ref('')

onMounted(() => {
  if (!editId.value) return
  const survey = getById(editId.value)
  if (!survey) {
    loadError.value = 'Опрос не найден'
    return
  }
  if (!canEdit(editId.value)) {
    loadError.value = 'Редактирование недоступно: уже есть ответы'
    return
  }
  title.value = survey.title
  questions.value = survey.questions.length ? [...survey.questions] : ['']
  modalOnCreate.value = survey.modalOnCreate
})

function addQuestion() {
  questions.value.push('')
}

function removeQuestion(index) {
  if (questions.value.length <= 1) return
  questions.value.splice(index, 1)
}

function onSubmit() {
  if (loadError.value) return

  if (isEdit.value) {
    const ok = updateSurvey(editId.value, {
      title: title.value,
      questions: questions.value,
      modalOnCreate: modalOnCreate.value,
    })
    if (!ok) {
      toast.error('Не удалось сохранить. Проверьте название и вопросы')
      return
    }
    toast.success('Опрос обновлён')
    router.push('/surveys')
    return
  }

  const id = createSurvey({
    title: title.value,
    questions: questions.value,
    modalOnCreate: modalOnCreate.value,
  })
  if (!id) {
    toast.error('Укажите название и хотя бы один вопрос')
    return
  }
  toast.success(
    modalOnCreate.value
      ? 'Опрос создан — студентам покажется модальное окно'
      : 'Опрос создан',
  )
  router.push('/surveys')
}
</script>

<template>
  <AppLayout
    :breadcrumbs="[
      { label: 'Главная', href: '/' },
      { label: 'Опросы', href: '/surveys' },
      { label: isEdit ? 'Редактирование' : 'Создание' },
    ]"
    active-route="surveys-new"
  >
    <div class="survey-new">
      <header class="survey-new__header">
        <div>
          <h1 class="survey-new__title">
            {{ isEdit ? 'Редактировать опрос' : 'Новый опрос' }}
          </h1>
          <p class="survey-new__subtitle">
            Редактирование доступно только до первого ответа
          </p>
        </div>
      </header>

      <BaseCard v-if="loadError" padding="md">
        <p class="survey-new__error">{{ loadError }}</p>
        <BaseButton variant="secondary" @click="router.push('/surveys')">
          К списку
        </BaseButton>
      </BaseCard>

      <BaseCard v-else padding="md">
        <div class="survey-new__form">
          <BaseInput
            v-model="title"
            label="Название"
            placeholder="Например, Оценка модуля"
          />

          <div class="survey-new__questions">
            <div class="survey-new__questions-head">
              <h2 class="survey-new__section-title">Вопросы</h2>
              <BaseButton variant="secondary" size="sm" icon="pencil-edit-02" @click="addQuestion">
                Добавить
              </BaseButton>
            </div>

            <div
              v-for="(q, index) in questions"
              :key="index"
              class="survey-new__question-row"
            >
              <BaseInput
                v-model="questions[index]"
                :label="`Вопрос ${index + 1}`"
                placeholder="Текст вопроса"
              />
              <BaseButton
                v-if="questions.length > 1"
                variant="link"
                size="sm"
                @click="removeQuestion(index)"
              >
                Удалить
              </BaseButton>
            </div>
          </div>

          <label class="survey-new__flag">
            <input v-model="modalOnCreate" type="checkbox" />
            <span>Показать модальное окно студенту сразу после создания</span>
          </label>

          <div class="survey-new__actions">
            <BaseButton variant="secondary" @click="router.push('/surveys')">
              Отмена
            </BaseButton>
            <BaseButton variant="primary" @click="onSubmit">
              {{ isEdit ? 'Сохранить' : 'Создать' }}
            </BaseButton>
          </div>

          <BaseChip v-if="modalOnCreate" size="sm" variant="pending">
            Модальное окно при создании включено
          </BaseChip>
        </div>
      </BaseCard>
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.survey-new {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-6 $space-6;
}

.survey-new__title {
  margin: 0 0 $space-1;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.survey-new__subtitle {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.survey-new__form {
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

.survey-new__section-title {
  margin: 0;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.survey-new__questions {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.survey-new__questions-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-3;
}

.survey-new__question-row {
  display: flex;
  flex-direction: column;
  gap: $space-1;
  align-items: flex-start;
}

.survey-new__flag {
  display: inline-flex;
  align-items: flex-start;
  gap: $space-2;
  font-size: $font-size-sm;
  color: $color-text-secondary;
  cursor: pointer;

  input {
    margin-top: 3px;
    width: 16px;
    height: 16px;
    accent-color: $color-primary;
  }
}

.survey-new__actions {
  display: flex;
  flex-wrap: wrap;
  gap: $space-3;
}

.survey-new__error {
  margin: 0 0 $space-4;
  color: $color-text-secondary;
}
</style>
