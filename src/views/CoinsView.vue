<script setup>
import AppLayout from '@/core/layouts/AppLayout.vue'
import {
  BaseButton,
  BaseCard,
  BaseChip,
  BaseInput,
  BaseSelect,
} from '@/core/components/ui'
import { useToast } from '@/core/composables/useToast.js'
import { useCoins } from '@/modules/coins/composables/useCoins.js'

const toast = useToast()
const { form, studentOptions, journalRows, submitOperation } = useCoins()

function onSubmit() {
  const result = submitOperation()
  if (!result.ok) {
    toast.error(result.error)
    return
  }
  toast.success(result.message)
}
</script>

<template>
  <AppLayout
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Коины' }]"
    active-route="coins"
  >
    <div class="page">
      <header class="page__header">
        <div>
          <h1 class="page__title">Коины</h1>
          <p class="page__subtitle">Ручное начисление и списание с обязательной причиной</p>
        </div>
      </header>

      <BaseCard padding="md" class="form-card">
        <template #title>Новая операция</template>
        <div class="form-grid">
          <BaseSelect
            v-model="form.studentId"
            label="Студент"
            :options="studentOptions"
          />
          <BaseInput
            v-model="form.amount"
            label="Сумма"
            type="number"
            hint="Положительная — начисление, отрицательная — списание"
            placeholder="Например, 10 или −5"
          />
          <BaseInput
            v-model="form.reason"
            label="Причина"
            placeholder="Обязательное поле"
            class="form-grid__full"
          />
        </div>
        <div class="page__actions">
          <BaseButton variant="primary" @click="onSubmit">Провести операцию</BaseButton>
        </div>
      </BaseCard>

      <BaseCard padding="md">
        <template #title>Журнал операций</template>
        <div v-if="!journalRows.length" class="page__empty">Записей пока нет</div>
        <div v-else class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Когда</th>
                <th>Студент</th>
                <th>Тип</th>
                <th>Сумма</th>
                <th>Причина</th>
                <th>Кто</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in journalRows" :key="row.id">
                <td>{{ row.atLabel }}</td>
                <td>{{ row.studentName }}</td>
                <td>
                  <BaseChip
                    :variant="row.amount >= 0 ? 'approved' : 'overdue'"
                    size="sm"
                  >
                    {{ row.typeLabel }}
                  </BaseChip>
                </td>
                <td :class="row.amount >= 0 ? 'is-credit' : 'is-debit'">
                  {{ row.amountLabel }}
                </td>
                <td>{{ row.reason }}</td>
                <td>{{ row.staffName }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>
    </div>
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

.form-card {
  max-width: 720px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-4;
}

.form-grid__full {
  grid-column: 1 / -1;
}

.page__actions {
  margin-top: $space-4;
  display: flex;
  justify-content: flex-end;
}

.page__empty {
  padding: $space-6;
  text-align: center;
  color: $color-text-muted;
  background: $color-bg-muted;
  border-radius: $radius-md;
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
}

.is-credit {
  color: $color-success;
  font-weight: $font-weight-semibold;
}

.is-debit {
  color: $color-error;
  font-weight: $font-weight-semibold;
}

@include media-tablet-down {
  .page {
    padding: $space-4;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
