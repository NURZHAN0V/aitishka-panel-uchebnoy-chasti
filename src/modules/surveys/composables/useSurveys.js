import { computed, ref } from 'vue'
import {
  createInitialSurveys,
  SURVEY_STATUS,
} from '@/modules/surveys/constants/surveys.js'

const surveys = ref(createInitialSurveys())

export function useSurveys() {
  const list = computed(() => surveys.value)

  function getById(id) {
    return surveys.value.find((s) => s.id === id) ?? null
  }

  function createSurvey({ title, questions, modalOnCreate }) {
    const trimmedTitle = title.trim()
    const cleanedQuestions = questions.map((q) => q.trim()).filter(Boolean)
    if (!trimmedTitle || !cleanedQuestions.length) return null

    const id = `srv-${Date.now()}`
    surveys.value.unshift({
      id,
      title: trimmedTitle,
      status: SURVEY_STATUS.ACTIVE,
      modalOnCreate: Boolean(modalOnCreate),
      questions: cleanedQuestions,
      answersCount: 0,
      results: {
        answered: [],
        declined: [],
        no_answer: ['Алина Петрова', 'Максим Орлов', 'София Иванова', 'Даниил Смирнов', 'Ева Кузнецова'],
      },
    })
    return id
  }

  function updateSurvey(id, { title, questions, modalOnCreate }) {
    const item = getById(id)
    if (!item || item.answersCount > 0) return false

    const trimmedTitle = title.trim()
    const cleanedQuestions = questions.map((q) => q.trim()).filter(Boolean)
    if (!trimmedTitle || !cleanedQuestions.length) return false

    item.title = trimmedTitle
    item.questions = cleanedQuestions
    item.modalOnCreate = Boolean(modalOnCreate)
    return true
  }

  function closeSurvey(id) {
    const item = getById(id)
    if (!item || item.status === SURVEY_STATUS.CLOSED) return false
    item.status = SURVEY_STATUS.CLOSED
    return true
  }

  function canEdit(id) {
    const item = getById(id)
    return Boolean(item && item.answersCount === 0 && item.status === SURVEY_STATUS.ACTIVE)
  }

  return {
    list,
    getById,
    createSurvey,
    updateSurvey,
    closeSurvey,
    canEdit,
  }
}
