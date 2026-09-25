import { computed, ref } from 'vue'
import { createInitialLessons } from '@/modules/schedule/constants/schedule.js'

const lessons = ref(createInitialLessons())

export function useSchedule() {
  const showCancelled = ref(false)
  const modalOpen = ref(false)
  const editingId = ref(null)

  const visibleLessons = computed(() => {
    const sorted = [...lessons.value].sort(
      (a, b) => new Date(a.datetime) - new Date(b.datetime),
    )
    if (showCancelled.value) return sorted
    return sorted.filter((l) => !l.cancelled)
  })

  function openCreate() {
    editingId.value = null
    modalOpen.value = true
  }

  function openEdit(id) {
    editingId.value = id
    modalOpen.value = true
  }

  function closeModal() {
    modalOpen.value = false
    editingId.value = null
  }

  function getById(id) {
    return lessons.value.find((l) => l.id === id) ?? null
  }

  function saveLesson(payload) {
    if (!payload.groupId || !payload.subjectId || !payload.teacherId || !payload.datetime) {
      return null
    }

    const data = {
      groupId: payload.groupId,
      subjectId: payload.subjectId,
      teacherId: payload.teacherId,
      datetime: payload.datetime,
      room: payload.online ? '' : (payload.room || ''),
      online: Boolean(payload.online),
      link: payload.online ? (payload.link || '') : '',
    }

    if (editingId.value) {
      const item = getById(editingId.value)
      if (!item) return null
      Object.assign(item, data)
      closeModal()
      return item.id
    }

    const id = `les-${Date.now()}`
    lessons.value.push({
      id,
      ...data,
      cancelled: false,
    })
    closeModal()
    return id
  }

  function cancelLesson(id) {
    const item = getById(id)
    if (!item || item.cancelled) return false
    item.cancelled = true
    return true
  }

  /** Мок: создаёт еженедельные копии на 4 недели вперёд */
  function applySemesterTemplate(sourceId) {
    const source = getById(sourceId)
    if (!source || source.cancelled) return 0

    let created = 0
    for (let week = 1; week <= 4; week += 1) {
      const dt = new Date(source.datetime)
      dt.setDate(dt.getDate() + week * 7)
      lessons.value.push({
        id: `les-tpl-${Date.now()}-${week}`,
        groupId: source.groupId,
        subjectId: source.subjectId,
        teacherId: source.teacherId,
        datetime: dt.toISOString(),
        room: source.room,
        online: source.online,
        link: source.link,
        cancelled: false,
      })
      created += 1
    }
    return created
  }

  return {
    lessons,
    visibleLessons,
    showCancelled,
    modalOpen,
    editingId,
    openCreate,
    openEdit,
    closeModal,
    getById,
    saveLesson,
    cancelLesson,
    applySemesterTemplate,
  }
}
