/** Моки студентов: фильтры, очередь паролей, отзывы */

export const STUDENT_STATUS_FILTERS = [
  { id: 'all', label: 'Все' },
  { id: 'active', label: 'Активные' },
  { id: 'transferred', label: 'Переведённые' },
  { id: 'expelled', label: 'Отчисленные' },
]

export const PASSWORD_QUEUE_STATUS = {
  new: 'Новая',
  processed: 'Обработана',
  rejected: 'Отклонена',
}

/** Очередь заявок «Забыли пароль» */
export const PASSWORD_QUEUE = [
  {
    id: 'pq1',
    name: 'Максим Орлов',
    dob: '2013-07-21',
    email: 'maxim.o@example.com',
    groupName: 'Python-1',
    status: 'new',
    createdAt: '2026-09-24T10:15:00',
  },
  {
    id: 'pq2',
    name: 'Ева Кузнецова',
    dob: '2017-05-09',
    email: 'eva.k@example.com',
    groupName: 'Scratch-1',
    status: 'new',
    createdAt: '2026-09-23T16:40:00',
  },
  {
    id: 'pq3',
    name: 'Даниил Смирнов',
    dob: '2012-01-18',
    email: 'daniil.s@example.com',
    groupName: 'Python-2',
    status: 'new',
    createdAt: '2026-09-22T09:05:00',
  },
]

export const TEACHER_REVIEWS = {
  s1: [
    {
      id: 'r1',
      teacher: 'Ирина Сергеевна Ковалёва',
      subject: 'Python',
      text: 'Алина активно участвует на занятиях и вовремя сдаёт ДЗ.',
      date: '2026-09-18',
    },
    {
      id: 'r2',
      teacher: 'Павел Андреевич Соколов',
      subject: 'HTML',
      text: 'Хороший прогресс по вёрстке, помогает одногруппникам.',
      date: '2026-09-10',
    },
  ],
  s2: [
    {
      id: 'r3',
      teacher: 'Ирина Сергеевна Ковалёва',
      subject: 'Python',
      text: 'Нужно чаще сдавать домашние вовремя.',
      date: '2026-09-20',
    },
  ],
  s3: [
    {
      id: 'r4',
      teacher: 'Ирина Сергеевна Ковалёва',
      subject: 'Python',
      text: 'Отличная серия без пропусков, лидер группы.',
      date: '2026-09-21',
    },
  ],
  s4: [
    {
      id: 'r5',
      teacher: 'Ирина Сергеевна Ковалёва',
      subject: 'Python',
      text: 'Стабильный средний уровень, есть потенциал.',
      date: '2026-09-15',
    },
  ],
  s5: [
    {
      id: 'r6',
      teacher: 'Павел Андреевич Соколов',
      subject: 'Scratch',
      text: 'Творческие проекты, любит экспериментировать.',
      date: '2026-09-19',
    },
  ],
  s6: [],
  s7: [],
}

export function getTeacherReviews(studentId) {
  return TEACHER_REVIEWS[studentId] || []
}

export function formatDebt(amount) {
  if (!amount) return '0 ₽'
  return `${amount.toLocaleString('ru-RU')} ₽`
}

export function formatDateRu(iso) {
  if (!iso) return '—'
  const value = iso.includes('T') ? iso : `${iso}T12:00:00`
  return new Date(value).toLocaleDateString('ru-RU')
}
