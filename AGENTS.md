# Панель учебной части

Поддомен: (планируется) · Школа: [itcampsochi.ru](https://itcampsochi.ru/)

## Документация

| Файл | Содержание |
| --- | --- |
| [docs/README.md](docs/README.md) | Оглавление |
| [docs/kontekst.md](docs/kontekst.md) | Контекст школы |
| [docs/produkt.md](docs/produkt.md) | Ссылка на продуктовую спецификацию |
| [docs/dizayn.md](docs/dizayn.md) | UI-kit и токены |
| [docs/ekrany.md](docs/ekrany.md) | Экраны и навигация |

Экосистема: [`../docs/README.md`](../docs/README.md) · продукт: [`../docs/panel-uchebnoy-chasti.md`](../docs/panel-uchebnoy-chasti.md)

---

## Правила разработки (Vue)

Источник практик: локальный репозиторий `vue-faq`.

### Стек

- **Vue 3**, **Composition API**, `<script setup>`
- **Vite**, **SCSS**, **vue-router**
- Свой UI-kit `Base*` в `core/components/ui/`
- Язык интерфейса — **русский**

### Зависимости

По умолчанию не ставить новые пакеты. Не ставить UI-фреймворки, Pinia, `@hugeicons/vue`.

Разрешённые: `vue`, `vue-router`, `vite`, `@vitejs/plugin-vue`, `sass`. Менеджер — **npm**.

### Архитектура

```txt
src/
├── core/{components/ui,composables,layouts,api}
├── assets/styles/
├── modules/
├── views/
├── App.vue
└── main.js
```

### Иконки

Только локальные Hugeicons SVG через `<BaseIcon name="…" />`. AVIF не используем.

### SCSS

Палитра как в дневнике/кабинете: primary `#8b5cf6`, page `#f5f7fa`.

### Качество

- `npm run build` после значимых изменений
- localStorage: префикс `panel-uchebnoy-chasti:`
- Продуктовая логика — в `../docs/panel-uchebnoy-chasti.md`
