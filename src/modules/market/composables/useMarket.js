import { computed, reactive, ref } from 'vue'
import { MOCK_PRODUCTS, coinsWord } from '../constants/market.js'

function emptyForm() {
  return {
    id: '',
    name: '',
    description: '',
    price: '',
    stock: '',
    photo: '',
  }
}

export function useMarket() {
  const products = reactive(MOCK_PRODUCTS.map((p) => ({ ...p })))
  const modalOpen = ref(false)
  const form = reactive(emptyForm())
  const isEdit = computed(() => Boolean(form.id))

  const catalog = computed(() =>
    products.map((item) => ({
      ...item,
      available: item.stock > 0,
      priceLabel: `${item.price} ${coinsWord(item.price)}`,
    })),
  )

  function openCreate() {
    Object.assign(form, emptyForm())
    modalOpen.value = true
  }

  function openEdit(item) {
    Object.assign(form, {
      id: item.id,
      name: item.name,
      description: item.description,
      price: String(item.price),
      stock: String(item.stock),
      photo: item.photo || '',
    })
    modalOpen.value = true
  }

  function closeModal() {
    modalOpen.value = false
  }

  function saveItem() {
    const name = form.name.trim()
    const description = form.description.trim()
    const price = Number(form.price)
    const stock = Number(form.stock)

    if (!name) return { ok: false, error: 'Укажите название' }
    if (!description) return { ok: false, error: 'Укажите описание' }
    if (!Number.isFinite(price) || price < 0) {
      return { ok: false, error: 'Укажите корректную цену' }
    }
    if (!Number.isFinite(stock) || stock < 0 || !Number.isInteger(stock)) {
      return { ok: false, error: 'Укажите целое количество на складе' }
    }

    if (form.id) {
      const target = products.find((p) => p.id === form.id)
      if (!target) return { ok: false, error: 'Товар не найден' }
      target.name = name
      target.description = description
      target.price = price
      target.stock = stock
      target.photo = form.photo
      modalOpen.value = false
      return { ok: true, message: 'Товар обновлён' }
    }

    products.unshift({
      id: `p-${Date.now()}`,
      name,
      description,
      price,
      stock,
      photo: form.photo,
    })
    modalOpen.value = false
    return { ok: true, message: 'Товар создан' }
  }

  return {
    catalog,
    modalOpen,
    form,
    isEdit,
    openCreate,
    openEdit,
    closeModal,
    saveItem,
  }
}
