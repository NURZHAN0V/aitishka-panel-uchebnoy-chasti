/** Общие моки экосистемы для панели */

export const GROUPS = [
  { id: 'g-python-1', name: 'Python-1', ageBand: '9–14', year: '2025/26', subjectIds: ['sub-python'], teacherIds: ['t1'] },
  { id: 'g-python-2', name: 'Python-2', ageBand: '9–14', year: '2025/26', subjectIds: ['sub-python'], teacherIds: ['t1'] },
  { id: 'g-scratch-1', name: 'Scratch-1', ageBand: '7–8', year: '2025/26', subjectIds: ['sub-scratch'], teacherIds: ['t2'] },
  { id: 'g-html-1', name: 'HTML-1', ageBand: '9–14', year: '2025/26', subjectIds: ['sub-html'], teacherIds: ['t1', 't2'] },
]

export const SUBJECTS = [
  { id: 'sub-python', name: 'Python', cover: '', groupIds: ['g-python-1', 'g-python-2'], teacherIds: ['t1'] },
  { id: 'sub-scratch', name: 'Scratch', cover: '', groupIds: ['g-scratch-1'], teacherIds: ['t2'] },
  { id: 'sub-html', name: 'HTML', cover: '', groupIds: ['g-html-1'], teacherIds: ['t1', 't2'] },
  { id: 'sub-roblox', name: 'Roblox', cover: '', groupIds: [], teacherIds: [] },
]

export const TEACHERS = [
  {
    id: 't1',
    name: 'Ирина Сергеевна Ковалёва',
    email: 'i.kovaleva@itcampsochi.ru',
    phone: '+7 (918) 555-12-34',
    blocked: false,
    subjectIds: ['sub-python', 'sub-html'],
    groupIds: ['g-python-1', 'g-python-2', 'g-html-1'],
    kpis: { groups: 3, homeworkReview: 12, unmarked: 2, attendance: 92, performance: 4.3 },
  },
  {
    id: 't2',
    name: 'Павел Андреевич Соколов',
    email: 'p.sokolov@itcampsochi.ru',
    phone: '+7 (918) 555-22-11',
    blocked: false,
    subjectIds: ['sub-scratch', 'sub-html'],
    groupIds: ['g-scratch-1', 'g-html-1'],
    kpis: { groups: 2, homeworkReview: 5, unmarked: 0, attendance: 95, performance: 4.5 },
  },
  {
    id: 't3',
    name: 'Елена Дмитриевна Новикова',
    email: 'e.novikova@itcampsochi.ru',
    phone: '+7 (918) 555-33-00',
    blocked: true,
    subjectIds: [],
    groupIds: [],
    kpis: { groups: 0, homeworkReview: 0, unmarked: 0, attendance: 0, performance: 0 },
  },
]

export const STUDENTS = [
  {
    id: 's1',
    name: 'Алина Петрова',
    groupId: 'g-python-1',
    status: 'active',
    dob: '2014-03-12',
    email: 'alina.p@example.com',
    phone: '+7 (900) 111-22-33',
    paymentCode: 'ALN-0142',
    coins: 340,
    debt: 0,
    attendanceStreak: 12,
    homeworkStreak: 8,
    avgGrade: 4.6,
    attendance: 96,
  },
  {
    id: 's2',
    name: 'Максим Орлов',
    groupId: 'g-python-1',
    status: 'active',
    dob: '2013-07-21',
    email: 'maxim.o@example.com',
    phone: '+7 (900) 222-33-44',
    paymentCode: 'MXM-0201',
    coins: 210,
    debt: 4500,
    attendanceStreak: 3,
    homeworkStreak: 2,
    avgGrade: 3.9,
    attendance: 88,
  },
  {
    id: 's3',
    name: 'София Иванова',
    groupId: 'g-python-1',
    status: 'active',
    dob: '2014-11-02',
    email: 'sofia.i@example.com',
    phone: '+7 (900) 333-44-55',
    paymentCode: 'SOF-0310',
    coins: 520,
    debt: 0,
    attendanceStreak: 20,
    homeworkStreak: 15,
    avgGrade: 5.0,
    attendance: 100,
  },
  {
    id: 's4',
    name: 'Даниил Смирнов',
    groupId: 'g-python-2',
    status: 'active',
    dob: '2012-01-18',
    email: 'daniil.s@example.com',
    phone: '+7 (900) 444-55-66',
    paymentCode: 'DAN-0444',
    coins: 180,
    debt: 2000,
    attendanceStreak: 5,
    homeworkStreak: 4,
    avgGrade: 4.1,
    attendance: 91,
  },
  {
    id: 's5',
    name: 'Ева Кузнецова',
    groupId: 'g-scratch-1',
    status: 'active',
    dob: '2017-05-09',
    email: 'eva.k@example.com',
    phone: '+7 (900) 555-66-77',
    paymentCode: 'EVA-0505',
    coins: 275,
    debt: 0,
    attendanceStreak: 9,
    homeworkStreak: 7,
    avgGrade: 4.4,
    attendance: 94,
  },
  {
    id: 's6',
    name: 'Артём Волков',
    groupId: 'g-html-1',
    status: 'transferred',
    dob: '2013-09-30',
    email: 'artem.v@example.com',
    phone: '+7 (900) 666-77-88',
    paymentCode: 'ART-0666',
    coins: 95,
    debt: 0,
    attendanceStreak: 0,
    homeworkStreak: 0,
    avgGrade: 3.7,
    attendance: 80,
  },
  {
    id: 's7',
    name: 'Кира Морозова',
    groupId: 'g-python-2',
    status: 'expelled',
    dob: '2012-12-12',
    email: 'kira.m@example.com',
    phone: '+7 (900) 777-88-99',
    paymentCode: 'KIR-0777',
    coins: 12,
    debt: 8000,
    attendanceStreak: 0,
    homeworkStreak: 0,
    avgGrade: 2.8,
    attendance: 55,
  },
]

export const STATUS_LABELS = {
  active: 'Активный',
  transferred: 'Переведён',
  expelled: 'Отчислен',
}

export function getGroupById(id) {
  return GROUPS.find((g) => g.id === id) ?? null
}

export function getStudentById(id) {
  return STUDENTS.find((s) => s.id === id) ?? null
}

export function getTeacherById(id) {
  return TEACHERS.find((t) => t.id === id) ?? null
}

export function getSubjectById(id) {
  return SUBJECTS.find((s) => s.id === id) ?? null
}

export function getStudentsByGroup(groupId) {
  return STUDENTS.filter((s) => s.groupId === groupId)
}
