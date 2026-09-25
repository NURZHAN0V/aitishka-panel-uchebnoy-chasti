<script setup>
import AppLayout from '@/core/layouts/AppLayout.vue'
import { BaseButton, BaseCard, BaseChip } from '@/core/components/ui'
import { useToast } from '@/core/composables/useToast.js'
import { useOrders } from '@/modules/orders/composables/useOrders.js'

const toast = useToast()
const { statusFilter, filters, filteredOrders, advanceStatus } = useOrders()

function onAdvance(order) {
  const result = advanceStatus(order.id)
  if (!result.ok) {
    toast.error(result.error)
    return
  }
  toast.success(`${order.productName}: ${result.message}`)
}
</script>

<template>
  <AppLayout
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Заказы' }]"
    active-route="orders"
  >
    <div class="page">
      <header class="page__header">
        <div>
          <h1 class="page__title">Заказы маркета</h1>
          <p class="page__subtitle">Оформлен → Готов к выдаче → Получен</p>
        </div>
      </header>

      <div class="page__chips">
        <BaseChip
          v-for="chip in filters"
          :key="chip.id"
          mode="filter"
          :active="statusFilter === chip.id"
          @click="statusFilter = chip.id"
        >
          {{ chip.label }}
        </BaseChip>
      </div>

      <div v-if="!filteredOrders.length" class="page__empty">Заказов нет</div>

      <ul v-else class="orders">
        <li v-for="order in filteredOrders" :key="order.id">
          <BaseCard padding="md" class="order-card">
            <div class="order-card__info">
              <h2 class="order-card__name">{{ order.productName }}</h2>
              <p class="order-card__meta">
                {{ order.studentName }} · {{ order.price }} коинов · {{ order.createdLabel }}
              </p>
              <BaseChip :variant="order.statusChip" size="sm">
                {{ order.statusLabel }}
              </BaseChip>
            </div>
            <BaseButton
              v-if="order.canAdvance"
              variant="primary"
              size="sm"
              @click="onAdvance(order)"
            >
              → {{ order.nextLabel }}
            </BaseButton>
          </BaseCard>
        </li>
      </ul>
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

.page__chips {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2;
}

.page__empty {
  padding: $space-8;
  text-align: center;
  color: $color-text-muted;
  background: $color-bg-muted;
  border-radius: $radius-card;
}

.orders {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.order-card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: $space-4;
}

.order-card__name {
  margin: 0 0 $space-1;
  font-size: $font-size-base;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.order-card__meta {
  margin: 0 0 $space-2;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

@include media-tablet-down {
  .page {
    padding: $space-4;
  }
}
</style>
