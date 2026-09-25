import { computed, reactive, ref } from 'vue'
import { STUDENTS, getStudentById } from '@/modules/shared/constants/entities.js'
import { STAFF_USER } from '@/modules/home/constants/staff.js'
import {
  MOCK_COIN_JOURNAL,
  formatAmountLabel,
  formatJournalDate,
} from '../constants/coins.js'

export function useCoins() {
  const journal = reactive(MOCK_COIN_JOURNAL.map((row) => ({ ...row })))
  const form = reactive({
    studentId: STUDENTS[0]?.id || '',
    amount: '',
    reason: '',
  })

  const studentOptions = computed(() =>
    STUDENTS.map((s) => ({ value: s.id, label: `${s.name} (${s.coins} коинов)` })),
  )

  const journalRows = computed(() =>
    [...journal]
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .map((row) => ({
        ...row,
        atLabel: formatJournalDate(row.at),
        amountLabel: formatAmountLabel(row.amount),
        typeLabel: row.amount >= 0 ? 'Начисление' : 'Списание',
      })),
  )

  function submitOperation() {
    const student = getStudentById(form.studentId)
    const amount = Number(form.amount)
    const reason = form.reason.trim()

    if (!student) return { ok: false, error: 'Выберите студента' }
    if (!Number.isFinite(amount) || amount === 0) {
      return { ok: false, error: 'Укажите сумму (положительную или отрицательную)' }
    }
    if (!reason) return { ok: false, error: 'Укажите причину' }

    const nextBalance = student.coins + amount
    if (nextBalance < 0) {
      return { ok: false, error: 'Недостаточно коинов для списания' }
    }

    student.coins = nextBalance
    journal.unshift({
      id: `cj-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      amount,
      reason,
      type: amount >= 0 ? 'credit' : 'debit',
      at: new Date().toISOString(),
      staffName: STAFF_USER.name,
    })

    form.amount = ''
    form.reason = ''

    return {
      ok: true,
      message:
        amount > 0
          ? `Начислено ${amount} коинов студенту ${student.name}`
          : `Списано ${Math.abs(amount)} коинов у ${student.name}`,
    }
  }

  return {
    form,
    studentOptions,
    journalRows,
    submitOperation,
  }
}
