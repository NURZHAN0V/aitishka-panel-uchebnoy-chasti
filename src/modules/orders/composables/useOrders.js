import { computed, reactive, ref } from 'vue'
import {
  MOCK_ORDERS,
  ORDER_STATUS,
  ORDER_STATUS_FILTERS,
  formatOrderDate,
} from '../constants/orders.js'

export function useOrders() {
  const orders = reactive(MOCK_ORDERS.map((o) => ({ ...o })))
  const statusFilter = ref('all')

  const filters = ORDER_STATUS_FILTERS

  const filteredOrders = computed(() => {
    const list =
      statusFilter.value === 'all'
        ? orders
        : orders.filter((o) => o.status === statusFilter.value)

    return [...list]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((order) => {
        const meta = ORDER_STATUS[order.status]
        return {
          ...order,
          statusLabel: meta.label,
          statusChip: meta.chip,
          createdLabel: formatOrderDate(order.createdAt),
          canAdvance: Boolean(meta.next),
          nextLabel: meta.next ? ORDER_STATUS[meta.next].label : null,
        }
      })
  })

  function advanceStatus(orderId) {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return { ok: false, error: 'Заказ не найден' }
    const next = ORDER_STATUS[order.status]?.next
    if (!next) return { ok: false, error: 'Заказ уже получен' }
    order.status = next
    return {
      ok: true,
      message: `Статус: ${ORDER_STATUS[next].label}`,
    }
  }

  return {
    statusFilter,
    filters,
    filteredOrders,
    advanceStatus,
  }
}
