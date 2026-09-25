<script setup>
import { reactive, ref } from 'vue'
import AppLayout from '@/core/layouts/AppLayout.vue'
import {
  BaseButton,
  BaseCard,
  BaseChip,
  BaseInput,
  BaseModal,
  BaseSelect,
} from '@/core/components/ui'
import { useToast } from '@/core/composables/useToast.js'
import { usePayments } from '@/modules/payments/composables/usePayments.js'
import { buildPurpose } from '@/modules/payments/constants/payments.js'

const toast = useToast()

const {
  bankDetails,
  selectedStudentId,
  studentOptions,
  selectedStudent,
  purposePreview,
  scheduleRows,
  paymentRows,
  debt,
  debtLabel,
  hasDebt,
  saveBankDetails,
  addScheduleRow,
  addPayment,
} = usePayments()

const bankForm = reactive({
  inn: bankDetails.inn,
  bik: bankDetails.bik,
  account: bankDetails.account,
  purposeTemplate: bankDetails.purposeTemplate,
})

const scheduleOpen = ref(false)
const paymentOpen = ref(false)

const scheduleForm = reactive({
  dueDate: '',
  description: '',
  amount: '',
})

const paymentForm = reactive({
  paidAt: '',
  purpose: '',
  amount: '',
})

function onSaveBank() {
  if (!bankForm.inn.trim() || !bankForm.bik.trim() || !bankForm.account.trim()) {
    toast.error('Заполните ИНН, БИК и расчётный счёт')
    return
  }
  if (!bankForm.purposeTemplate.includes('{code}')) {
    toast.error('В шаблоне назначения должен быть плейсхолдер {code}')
    return
  }
  saveBankDetails(bankForm)
  toast.success('Реквизиты сохранены')
}

function openScheduleModal() {
  if (!selectedStudentId.value) {
    toast.error('Выберите студента')
    return
  }
  scheduleForm.dueDate = ''
  scheduleForm.description = ''
  scheduleForm.amount = ''
  scheduleOpen.value = true
}

function submitSchedule() {
  if (!scheduleForm.dueDate || !scheduleForm.description.trim() || !scheduleForm.amount) {
    toast.error('Заполните дату, описание и сумму')
    return
  }
  const ok = addScheduleRow(scheduleForm)
  if (!ok) {
    toast.error('Не удалось добавить строку')
    return
  }
  scheduleOpen.value = false
  toast.success('Строка графика добавлена')
}

function openPaymentModal() {
  if (!selectedStudentId.value) {
    toast.error('Выберите студента')
    return
  }
  paymentForm.paidAt = new Date().toISOString().slice(0, 10)
  paymentForm.purpose = buildPurpose(
    bankDetails.purposeTemplate,
    selectedStudent.value?.paymentCode,
  )
  paymentForm.amount = ''
  paymentOpen.value = true
}

function submitPayment() {
  if (!paymentForm.paidAt || !paymentForm.purpose.trim() || !paymentForm.amount) {
    toast.error('Заполните дату, назначение и сумму')
    return
  }
  const ok = addPayment(paymentForm)
  if (!ok) {
    toast.error('Не удалось добавить оплату')
    return
  }
  paymentOpen.value = false
  toast.success('Оплата внесена')
}
</script>

<template>
  <AppLayout
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Платежи' }]"
    active-route="payments"
  >
    <div class="page">
      <header class="page__header">
        <div>
          <h1 class="page__title">Платежи</h1>
          <p class="page__subtitle">Реквизиты, график и история оплат студентов</p>
        </div>
      </header>

      <BaseCard padding="md">
        <template #title>Банковские реквизиты</template>
        <div class="form-grid">
          <BaseInput v-model="bankForm.inn" label="ИНН" />
          <BaseInput v-model="bankForm.bik" label="БИК" />
          <BaseInput v-model="bankForm.account" label="Расчётный счёт" />
          <BaseInput
            v-model="bankForm.purposeTemplate"
            label="Шаблон назначения платежа"
            hint="Используйте {code} для кода студента"
          />
        </div>
        <p class="preview">
          Пример: <strong>{{ purposePreview || '—' }}</strong>
        </p>
        <div class="page__actions">
          <BaseButton variant="primary" @click="onSaveBank">Сохранить реквизиты</BaseButton>
        </div>
      </BaseCard>

      <BaseCard padding="md">
        <template #title>Студент</template>
        <BaseSelect
          v-model="selectedStudentId"
          label="Выберите студента"
          :options="studentOptions"
          placeholder="Студент"
        />
        <p v-if="selectedStudent" class="student-meta">
          Код платежа: <strong>{{ selectedStudent.paymentCode }}</strong>
          <BaseChip
            class="student-meta__debt"
            :variant="hasDebt ? 'overdue' : 'approved'"
            size="sm"
          >
            Долг: {{ debtLabel }}
          </BaseChip>
        </p>
      </BaseCard>

      <div class="page__grid">
        <BaseCard padding="md">
          <template #header>
            <div class="card-head">
              <h2 class="card-head__title">График платежей</h2>
              <BaseButton variant="secondary" size="sm" @click="openScheduleModal">
                Добавить
              </BaseButton>
            </div>
          </template>

          <div v-if="!scheduleRows.length" class="page__empty">Нет строк графика</div>
          <div v-else class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Оплатить до</th>
                  <th>Описание</th>
                  <th>К оплате</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in scheduleRows" :key="row.id">
                  <td>{{ row.dueLabel }}</td>
                  <td>{{ row.description }}</td>
                  <td>{{ row.amountLabel }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </BaseCard>

        <BaseCard padding="md">
          <template #header>
            <div class="card-head">
              <h2 class="card-head__title">История платежей</h2>
              <BaseButton variant="secondary" size="sm" @click="openPaymentModal">
                Внести оплату
              </BaseButton>
            </div>
          </template>

          <div v-if="!paymentRows.length" class="page__empty">Оплат пока нет</div>
          <div v-else class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Назначение</th>
                  <th>Оплачено</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in paymentRows" :key="row.id">
                  <td>{{ row.dateLabel }}</td>
                  <td>{{ row.purpose }}</td>
                  <td>{{ row.amountLabel }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </BaseCard>
      </div>

      <p v-if="selectedStudent" class="debt-summary" :class="{ 'debt-summary--warn': debt > 0 }">
        Задолженность: <strong>{{ debtLabel }}</strong>
        (график − оплаты)
      </p>
    </div>

    <BaseModal v-model="scheduleOpen" title="Строка графика" size="md">
      <div class="form-grid">
        <BaseInput v-model="scheduleForm.dueDate" label="Оплатить до" type="date" />
        <BaseInput v-model="scheduleForm.description" label="Описание" />
        <BaseInput v-model="scheduleForm.amount" label="Сумма, ₽" type="number" />
      </div>
      <template #footer>
        <BaseButton variant="secondary" @click="scheduleOpen = false">Отмена</BaseButton>
        <BaseButton variant="primary" @click="submitSchedule">Добавить</BaseButton>
      </template>
    </BaseModal>

    <BaseModal v-model="paymentOpen" title="Внести оплату" size="md">
      <div class="form-grid">
        <BaseInput v-model="paymentForm.paidAt" label="Дата" type="date" />
        <BaseInput v-model="paymentForm.purpose" label="Назначение платежа" />
        <BaseInput v-model="paymentForm.amount" label="Сумма, ₽" type="number" />
      </div>
      <template #footer>
        <BaseButton variant="secondary" @click="paymentOpen = false">Отмена</BaseButton>
        <BaseButton variant="primary" @click="submitPayment">Сохранить</BaseButton>
      </template>
    </BaseModal>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.page {
  padding: $space-4 $space-6 $space-6;
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

.page__header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: $space-4;
}

.page__title {
  margin: 0 0 $space-1;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.page__subtitle {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.page__actions {
  margin-top: $space-4;
  display: flex;
  justify-content: flex-end;
}

.page__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-5;
  align-items: start;
}

.page__empty {
  padding: $space-6;
  text-align: center;
  color: $color-text-muted;
  background: $color-bg-muted;
  border-radius: $radius-md;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-4;
}

.preview {
  margin: $space-4 0 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.student-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $space-3;
  margin: $space-4 0 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-3;
  width: 100%;
}

.card-head__title {
  margin: 0;
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.table-wrap {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: $font-size-sm;

  th,
  td {
    padding: $space-3;
    text-align: left;
    border-bottom: 1px solid $color-border-light;
    vertical-align: top;
  }

  th {
    color: $color-text-muted;
    font-weight: $font-weight-semibold;
  }

  td {
    color: $color-text-primary;
  }
}

.debt-summary {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;

  &--warn {
    color: $color-error;

    strong {
      color: $color-error;
    }
  }
}

@include media-tablet-down {
  .page {
    padding: $space-4;
  }

  .page__grid,
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
