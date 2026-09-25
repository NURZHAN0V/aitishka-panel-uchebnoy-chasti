import { computed, ref } from 'vue'
import { createInitialSubjects } from '@/modules/subjects/constants/subjects.js'

const subjects = ref(createInitialSubjects())

export function useSubjects() {
  const modalOpen = ref(false)
  const editingId = ref(null)

  const list = computed(() => subjects.value)

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
    return subjects.value.find((s) => s.id === id) ?? null
  }

  function saveSubject({ name, cover, groupIds, teacherIds }) {
    const trimmed = name.trim()
    if (!trimmed) return null

    if (editingId.value) {
      const item = getById(editingId.value)
      if (!item) return null
      item.name = trimmed
      item.cover = cover || ''
      item.groupIds = [...groupIds]
      item.teacherIds = [...teacherIds]
      closeModal()
      return item.id
    }

    const id = `sub-${Date.now()}`
    subjects.value.unshift({
      id,
      name: trimmed,
      cover: cover || '',
      groupIds: [...groupIds],
      teacherIds: [...teacherIds],
    })
    closeModal()
    return id
  }

  return {
    list,
    modalOpen,
    editingId,
    openCreate,
    openEdit,
    closeModal,
    getById,
    saveSubject,
  }
}
