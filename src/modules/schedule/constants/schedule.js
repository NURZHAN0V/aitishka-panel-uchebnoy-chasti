/** Мок расписания учебной части */

export function createInitialLessons() {
  return [
    {
      id: 'les-1',
      groupId: 'g-python-1',
      subjectId: 'sub-python',
      teacherId: 't1',
      datetime: '2026-09-22T10:40:00',
      room: '204',
      online: false,
      link: '',
      cancelled: false,
    },
    {
      id: 'les-2',
      groupId: 'g-scratch-1',
      subjectId: 'sub-scratch',
      teacherId: 't2',
      datetime: '2026-09-22T12:20:00',
      room: '',
      online: true,
      link: 'https://meet.example.com/scratch-1',
      cancelled: false,
    },
    {
      id: 'les-3',
      groupId: 'g-html-1',
      subjectId: 'sub-html',
      teacherId: 't1',
      datetime: '2026-09-23T09:00:00',
      room: '101',
      online: false,
      link: '',
      cancelled: false,
    },
    {
      id: 'les-4',
      groupId: 'g-python-2',
      subjectId: 'sub-python',
      teacherId: 't1',
      datetime: '2026-09-24T10:40:00',
      room: '204',
      online: false,
      link: '',
      cancelled: true,
    },
    {
      id: 'les-5',
      groupId: 'g-python-1',
      subjectId: 'sub-python',
      teacherId: 't1',
      datetime: '2026-09-25T14:00:00',
      room: '205',
      online: false,
      link: '',
      cancelled: false,
    },
    {
      id: 'les-6',
      groupId: 'g-html-1',
      subjectId: 'sub-html',
      teacherId: 't2',
      datetime: '2026-09-26T12:20:00',
      room: '',
      online: true,
      link: 'https://meet.example.com/html-1',
      cancelled: false,
    },
  ]
}

export function formatLessonDateTime(iso) {
  const d = new Date(iso)
  return d.toLocaleString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function toDatetimeLocalValue(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function fromDatetimeLocalValue(value) {
  if (!value) return ''
  return new Date(value).toISOString()
}
