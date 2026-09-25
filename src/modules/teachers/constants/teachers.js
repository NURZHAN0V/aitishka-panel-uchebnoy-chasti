/** Моки KPI и подписей для преподавателей */

export const TEACHER_KPI_LABELS = [
  { key: 'groups', label: 'Групп', icon: 'user-group', unit: '' },
  { key: 'homeworkReview', label: 'ДЗ на проверке', icon: 'book-open-01', unit: '' },
  { key: 'unmarked', label: 'Неотмеченных', icon: 'clipboard', unit: '' },
  { key: 'attendance', label: 'Посещаемость', icon: 'check-circle', unit: '%' },
  { key: 'performance', label: 'Успеваемость', icon: 'chart-bar', unit: '' },
]

export function formatKpiValue(key, value) {
  if (key === 'performance') {
    return Number(value).toFixed(1)
  }
  return String(value)
}
