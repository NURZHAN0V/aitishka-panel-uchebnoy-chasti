import { STAFF_USER } from '@/modules/home/constants/staff.js'

function atOffset(dayOffset, hour = 12, minute = 0) {
  const date = new Date()
  date.setDate(date.getDate() + dayOffset)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

/** Журнал ручных операций с коинами */
export const MOCK_COIN_JOURNAL = [
  {
    id: 'cj-1',
    studentId: 's1',
    studentName: 'Алина Петрова',
    amount: 50,
    reason: 'Поощрение за победу в хакатоне',
    type: 'credit',
    at: atOffset(-1, 14, 20),
    staffName: STAFF_USER.name,
  },
  {
    id: 'cj-2',
    studentId: 's2',
    studentName: 'Максим Орлов',
    amount: -20,
    reason: 'Коррекция ошибочного начисления',
    type: 'debit',
    at: atOffset(-3, 11, 5),
    staffName: STAFF_USER.name,
  },
  {
    id: 'cj-3',
    studentId: 's3',
    studentName: 'София Иванова',
    amount: 10,
    reason: 'Бонус за отзыв на Яндекс (ручное подтверждение)',
    type: 'credit',
    at: atOffset(-5, 16, 40),
    staffName: STAFF_USER.name,
  },
]

export function formatJournalDate(iso) {
  const date = new Date(iso)
  const day = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
  const time = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
  return `${day}, ${time}`
}

export function formatAmountLabel(amount) {
  const sign = amount > 0 ? '+' : amount < 0 ? '−' : ''
  return `${sign}${Math.abs(amount)}`
}
