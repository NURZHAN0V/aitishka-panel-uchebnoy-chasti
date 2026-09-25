/** Моки групп: возраст, год, рейтинг */

export const AGE_BAND_OPTIONS = [
  { value: '7–8', label: '7–8 лет' },
  { value: '9–14', label: '9–14 лет' },
]

export const YEAR_OPTIONS = [
  { value: '2024/25', label: '2024/25' },
  { value: '2025/26', label: '2025/26' },
  { value: '2026/27', label: '2026/27' },
]

/** Рейтинг группы за календарный месяц (view-only) */
export const GROUP_RATINGS = {
  'g-python-1': [
    { place: 1, studentId: 's3', name: 'София Иванова', score: 98 },
    { place: 2, studentId: 's1', name: 'Алина Петрова', score: 91 },
    { place: 3, studentId: 's2', name: 'Максим Орлов', score: 74 },
  ],
  'g-python-2': [
    { place: 1, studentId: 's4', name: 'Даниил Смирнов', score: 82 },
    { place: 2, studentId: 's7', name: 'Кира Морозова', score: 41 },
  ],
  'g-scratch-1': [
    { place: 1, studentId: 's5', name: 'Ева Кузнецова', score: 88 },
  ],
  'g-html-1': [
    { place: 1, studentId: 's6', name: 'Артём Волков', score: 70 },
  ],
}

export function getGroupRating(groupId) {
  return GROUP_RATINGS[groupId] || []
}
