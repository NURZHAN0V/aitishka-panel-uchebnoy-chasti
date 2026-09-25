import { computed, reactive, ref } from 'vue'
import { STUDENTS, getStudentById } from '@/modules/shared/constants/entities.js'
import {
  DEFAULT_BANK_DETAILS,
  MOCK_PAYMENTS_BY_STUDENT,
  MOCK_SCHEDULE_BY_STUDENT,
  buildPurpose,
  formatDateRu,
  formatMoney,
} from '../constants/payments.js'

function cloneMap(source) {
  const result = {}
  for (const [key, rows] of Object.entries(source)) {
    result[key] = rows.map((row) => ({ ...row }))
  }
  return result
}

export function usePayments() {
  const bankDetails = reactive({ ...DEFAULT_BANK_DETAILS })
  const selectedStudentId = ref(STUDENTS[0]?.id || '')
  const scheduleByStudent = reactive(cloneMap(MOCK_SCHEDULE_BY_STUDENT))
  const paymentsByStudent = reactive(cloneMap(MOCK_PAYMENTS_BY_STUDENT))

  const studentOptions = computed(() =>
    STUDENTS.map((s) => ({ value: s.id, label: s.name })),
  )

  const selectedStudent = computed(() => getStudentById(selectedStudentId.value))

  const purposePreview = computed(() =>
    buildPurpose(bankDetails.purposeTemplate, selectedStudent.value?.paymentCode),
  )

  const scheduleRows = computed(() => {
    const rows = scheduleByStudent[selectedStudentId.value] || []
    return [...rows]
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .map((row) => ({
        ...row,
        dueLabel: formatDateRu(row.dueDate),
        amountLabel: formatMoney(row.amount),
      }))
  })

  const paymentRows = computed(() => {
    const rows = paymentsByStudent[selectedStudentId.value] || []
    return [...rows]
      .sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt))
      .map((row) => ({
        ...row,
        dateLabel: formatDateRu(row.paidAt),
        amountLabel: formatMoney(row.amount),
      }))
  })

  const scheduleTotal = computed(() =>
    scheduleRows.value.reduce((sum, row) => sum + Number(row.amount || 0), 0),
  )

  const paidTotal = computed(() =>
    paymentRows.value.reduce((sum, row) => sum + Number(row.amount || 0), 0),
  )

  /** Задолженность = сумма графика − сумма оплат */
  const debt = computed(() => Math.max(0, scheduleTotal.value - paidTotal.value))

  const debtLabel = computed(() => formatMoney(debt.value))
  const hasDebt = computed(() => debt.value > 0)

  function ensureStudentBuckets(studentId) {
    if (!scheduleByStudent[studentId]) scheduleByStudent[studentId] = []
    if (!paymentsByStudent[studentId]) paymentsByStudent[studentId] = []
  }

  function saveBankDetails(payload) {
    bankDetails.inn = payload.inn.trim()
    bankDetails.bik = payload.bik.trim()
    bankDetails.account = payload.account.trim()
    bankDetails.purposeTemplate = payload.purposeTemplate.trim()
  }

  function addScheduleRow({ dueDate, description, amount }) {
    const studentId = selectedStudentId.value
    if (!studentId) return false
    ensureStudentBuckets(studentId)
    scheduleByStudent[studentId].push({
      id: `sch-${Date.now()}`,
      dueDate: new Date(`${dueDate}T12:00:00`).toISOString(),
      description: description.trim(),
      amount: Number(amount),
    })
    return true
  }

  function addPayment({ paidAt, purpose, amount }) {
    const studentId = selectedStudentId.value
    if (!studentId) return false
    ensureStudentBuckets(studentId)
    paymentsByStudent[studentId].push({
      id: `pay-${Date.now()}`,
      paidAt: new Date(`${paidAt}T12:00:00`).toISOString(),
      purpose: purpose.trim(),
      amount: Number(amount),
    })
    return true
  }

  return {
    bankDetails,
    selectedStudentId,
    studentOptions,
    selectedStudent,
    purposePreview,
    scheduleRows,
    paymentRows,
    scheduleTotal,
    paidTotal,
    debt,
    debtLabel,
    hasDebt,
    saveBankDetails,
    addScheduleRow,
    addPayment,
    formatMoney,
  }
}
