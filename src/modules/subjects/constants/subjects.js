import { SUBJECTS as SHARED_SUBJECTS } from '@/modules/shared/constants/entities.js'

/** Клон предметов из shared для локального CRUD на моках */
export function createInitialSubjects() {
  return SHARED_SUBJECTS.map((s) => ({
    id: s.id,
    name: s.name,
    cover: s.cover || '',
    groupIds: [...s.groupIds],
    teacherIds: [...s.teacherIds],
  }))
}
