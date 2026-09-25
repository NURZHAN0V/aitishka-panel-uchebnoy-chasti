/** Моки опросов */

export const SURVEY_STATUS = {
  ACTIVE: 'active',
  CLOSED: 'closed',
}

export const SURVEY_STATUS_LABELS = {
  active: 'Активный',
  closed: 'Закрыт',
}

export const RESULT_TABS = [
  { id: 'answered', label: 'Прошли' },
  { id: 'declined', label: 'Отказались' },
  { id: 'no_answer', label: 'Не ответили' },
]

export function createInitialSurveys() {
  return [
    {
      id: 'srv-1',
      title: 'Оценка первого модуля Python',
      status: SURVEY_STATUS.ACTIVE,
      modalOnCreate: true,
      questions: [
        'Насколько понятны были объяснения?',
        'Хватает ли практики на уроках?',
        'Что улучшить в следующем модуле?',
      ],
      answersCount: 4,
      results: {
        answered: ['Алина Петрова', 'Максим Орлов', 'София Иванова', 'Даниил Смирнов'],
        declined: ['Кира Морозова'],
        no_answer: ['Ева Кузнецова', 'Артём Волков'],
      },
    },
    {
      id: 'srv-2',
      title: 'Удовлетворённость расписанием',
      status: SURVEY_STATUS.ACTIVE,
      modalOnCreate: false,
      questions: [
        'Удобно ли время занятий?',
        'Хотите больше онлайн-пар?',
      ],
      answersCount: 0,
      results: {
        answered: [],
        declined: [],
        no_answer: ['Алина Петрова', 'Максим Орлов', 'София Иванова', 'Даниил Смирнов', 'Ева Кузнецова'],
      },
    },
    {
      id: 'srv-3',
      title: 'Обратная связь по Scratch',
      status: SURVEY_STATUS.CLOSED,
      modalOnCreate: true,
      questions: [
        'Понравились ли проекты?',
        'Готовы ли перейти к Python?',
      ],
      answersCount: 3,
      results: {
        answered: ['Ева Кузнецова', 'София Иванова', 'Максим Орлов'],
        declined: ['Артём Волков'],
        no_answer: ['Алина Петрова'],
      },
    },
  ]
}
