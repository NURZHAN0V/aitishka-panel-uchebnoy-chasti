/** Счётчики сводки учебной части */

export const DASHBOARD_COUNTERS = [
  {
    id: 'password-requests',
    label: 'Заявки «Забыли пароль»',
    count: 3,
    icon: 'alert-circle',
    href: '/students',
  },
  {
    id: 'yandex-pending',
    label: 'Отзывы Яндекс на проверке',
    count: 5,
    icon: 'star',
    href: '/moderation/yandex',
  },
  {
    id: 'photos-pending',
    label: 'Фото на модерации',
    count: 7,
    icon: 'image-01',
    href: '/moderation/photos',
  },
  {
    id: 'orders-issue',
    label: 'Заказы к выдаче',
    count: 4,
    icon: 'shopping-bag',
    href: '/orders',
  },
  {
    id: 'active-surveys',
    label: 'Активные опросы',
    count: 2,
    icon: 'message-01',
    href: '/surveys',
  },
]
