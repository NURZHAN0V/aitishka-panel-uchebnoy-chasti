export const ORDER_STATUS = {
  placed: { id: 'placed', label: 'Оформлен', chip: 'pending', next: 'ready' },
  ready: { id: 'ready', label: 'Готов к выдаче', chip: 'current', next: 'received' },
  received: { id: 'received', label: 'Получен', chip: 'approved', next: null },
}

export const ORDER_STATUS_FILTERS = [
  { id: 'all', label: 'Все' },
  { id: 'placed', label: 'Оформлен' },
  { id: 'ready', label: 'Готов к выдаче' },
  { id: 'received', label: 'Получен' },
]

function atOffset(dayOffset, hour = 12, minute = 0) {
  const date = new Date()
  date.setDate(date.getDate() + dayOffset)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

/** Каталог маркета */
export const MOCK_PRODUCTS = [
  {
    id: 'p-hoodie',
    name: 'Худи IT Camp',
    description: 'Тёплое худи с логотипом школы',
    price: 150,
    stock: 6,
    photo: '',
  },
  {
    id: 'p-bottle',
    name: 'Бутылка IT Camp',
    description: 'Многоразовая бутылка 0,5 л',
    price: 90,
    stock: 12,
    photo: '',
  },
  {
    id: 'p-notebook',
    name: 'Блокнот в клетку',
    description: 'Блокнот А5 с фирменной обложкой',
    price: 80,
    stock: 20,
    photo: '',
  },
  {
    id: 'p-stickers',
    name: 'Набор стикеров',
    description: 'Стикеры с персонажами лагеря',
    price: 40,
    stock: 15,
    photo: '',
  },
  {
    id: 'p-dino',
    name: 'Мягкая игрушка Дино',
    description: 'Плюшевый динозавр — талисман школы',
    price: 200,
    stock: 4,
    photo: '',
  },
  {
    id: 'p-hoop',
    name: 'Баскетбольное кольцо',
    description: 'Настольное кольцо для перемены',
    price: 300,
    stock: 0,
    photo: '',
  },
]

/** Заказы маркета */
export const MOCK_ORDERS = [
  {
    id: 'o-1',
    productId: 'p-stickers',
    productName: 'Набор стикеров',
    studentId: 's1',
    studentName: 'Алина Петрова',
    price: 40,
    status: 'received',
    createdAt: atOffset(-6, 20, 0),
  },
  {
    id: 'o-2',
    productId: 'p-notebook',
    productName: 'Блокнот в клетку',
    studentId: 's3',
    studentName: 'София Иванова',
    price: 80,
    status: 'ready',
    createdAt: atOffset(-3, 12, 45),
  },
  {
    id: 'o-3',
    productId: 'p-bottle',
    productName: 'Бутылка IT Camp',
    studentId: 's2',
    studentName: 'Максим Орлов',
    price: 90,
    status: 'placed',
    createdAt: atOffset(-1, 18, 10),
  },
  {
    id: 'o-4',
    productId: 'p-hoodie',
    productName: 'Худи IT Camp',
    studentId: 's5',
    studentName: 'Ева Кузнецова',
    price: 150,
    status: 'placed',
    createdAt: atOffset(0, 10, 5),
  },
]

export function formatOrderDate(iso) {
  const date = new Date(iso)
  const day = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(date)
  const time = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
  return `${day}, ${time}`
}

export function coinsWord(n) {
  const abs = Math.abs(n) % 100
  const mod10 = abs % 10
  if (abs > 10 && abs < 20) return 'коинов'
  if (mod10 === 1) return 'коин'
  if (mod10 >= 2 && mod10 <= 4) return 'коина'
  return 'коинов'
}
