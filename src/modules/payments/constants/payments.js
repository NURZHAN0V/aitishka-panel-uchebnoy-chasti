/** Реквизиты и моки платежей учебной части */

export const DEFAULT_BANK_DETAILS = {
  inn: '2320250123',
  bik: '040349602',
  account: '40702810900000001234',
  purposeTemplate: 'Оплата обучения, код {code}',
}

function isoDate(year, month, day) {
  return new Date(year, month - 1, day, 12, 0, 0, 0).toISOString()
}

/** График платежей по studentId */
export const MOCK_SCHEDULE_BY_STUDENT = {
  s1: [
    { id: 'sch-s1-1', dueDate: isoDate(2026, 6, 15), description: 'Обучение за июнь 2026', amount: 8000 },
    { id: 'sch-s1-2', dueDate: isoDate(2026, 7, 15), description: 'Обучение за июль 2026', amount: 8000 },
    { id: 'sch-s1-3', dueDate: isoDate(2026, 8, 15), description: 'Обучение за август 2026', amount: 8000 },
  ],
  s2: [
    { id: 'sch-s2-1', dueDate: isoDate(2026, 7, 15), description: 'Обучение за июль 2026', amount: 8000 },
    { id: 'sch-s2-2', dueDate: isoDate(2026, 8, 15), description: 'Обучение за август 2026', amount: 8000 },
    { id: 'sch-s2-3', dueDate: isoDate(2026, 9, 15), description: 'Обучение за сентябрь 2026', amount: 8000 },
  ],
  s4: [
    { id: 'sch-s4-1', dueDate: isoDate(2026, 8, 15), description: 'Обучение за август 2026', amount: 8000 },
    { id: 'sch-s4-2', dueDate: isoDate(2026, 9, 15), description: 'Обучение за сентябрь 2026', amount: 8000 },
  ],
  s7: [
    { id: 'sch-s7-1', dueDate: isoDate(2026, 5, 15), description: 'Обучение за май 2026', amount: 8000 },
    { id: 'sch-s7-2', dueDate: isoDate(2026, 6, 15), description: 'Обучение за июнь 2026', amount: 8000 },
  ],
}

/** История оплат по studentId */
export const MOCK_PAYMENTS_BY_STUDENT = {
  s1: [
    {
      id: 'pay-s1-1',
      paidAt: isoDate(2026, 6, 12),
      purpose: 'Оплата обучения, код ALN-0142 (июнь)',
      amount: 8000,
    },
    {
      id: 'pay-s1-2',
      paidAt: isoDate(2026, 7, 14),
      purpose: 'Оплата обучения, код ALN-0142 (июль)',
      amount: 8000,
    },
    {
      id: 'pay-s1-3',
      paidAt: isoDate(2026, 8, 20),
      purpose: 'Оплата обучения, код ALN-0142 (август, частично)',
      amount: 3000,
    },
  ],
  s2: [
    {
      id: 'pay-s2-1',
      paidAt: isoDate(2026, 7, 20),
      purpose: 'Оплата обучения, код MXM-0201 (июль)',
      amount: 3500,
    },
  ],
  s4: [
    {
      id: 'pay-s4-1',
      paidAt: isoDate(2026, 8, 10),
      purpose: 'Оплата обучения, код DAN-0444 (август)',
      amount: 6000,
    },
  ],
  s7: [
    {
      id: 'pay-s7-1',
      paidAt: isoDate(2026, 5, 20),
      purpose: 'Оплата обучения, код KIR-0777 (май)',
      amount: 8000,
    },
  ],
}

export function formatMoney(amount) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDateRu(iso) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

export function buildPurpose(template, code) {
  return String(template || '').replaceAll('{code}', code || '')
}
