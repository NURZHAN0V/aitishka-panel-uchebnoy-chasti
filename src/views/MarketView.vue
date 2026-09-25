<script setup>
import AppLayout from '@/core/layouts/AppLayout.vue'
import {
  BaseButton,
  BaseCard,
  BaseChip,
  BaseIcon,
  BaseInput,
  BaseModal,
} from '@/core/components/ui'
import { useToast } from '@/core/composables/useToast.js'
import { useMarket } from '@/modules/market/composables/useMarket.js'

const toast = useToast()
const {
  catalog,
  modalOpen,
  form,
  isEdit,
  openCreate,
  openEdit,
  closeModal,
  saveItem,
} = useMarket()

function onSave() {
  const result = saveItem()
  if (!result.ok) {
    toast.error(result.error)
    return
  }
  toast.success(result.message)
}
</script>

<template>
  <AppLayout
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Каталог маркета' }]"
    active-route="market"
  >
    <div class="page">
      <header class="page__header">
        <div>
          <h1 class="page__title">Каталог маркета</h1>
          <p class="page__subtitle">Товары за коины: цена, остаток, доступность</p>
        </div>
        <BaseButton variant="primary" icon="pencil-edit-02" @click="openCreate">
          Добавить товар
        </BaseButton>
      </header>

      <div v-if="!catalog.length" class="page__empty">Каталог пуст</div>

      <div v-else class="catalog">
        <BaseCard
          v-for="item in catalog"
          :key="item.id"
          padding="md"
          class="product-card"
        >
          <div class="product-card__photo" aria-hidden="true">
            <BaseIcon name="image-01" :size="36" />
          </div>
          <div class="product-card__body">
            <div class="product-card__top">
              <h2 class="product-card__name">{{ item.name }}</h2>
              <BaseChip v-if="!item.available" variant="missing" size="sm">
                Нет в наличии
              </BaseChip>
            </div>
            <p class="product-card__desc">{{ item.description }}</p>
            <dl class="product-card__meta">
              <div>
                <dt>Цена</dt>
                <dd>{{ item.priceLabel }}</dd>
              </div>
              <div>
                <dt>Склад</dt>
                <dd>{{ item.stock }}</dd>
              </div>
            </dl>
            <BaseButton variant="secondary" size="sm" @click="openEdit(item)">
              Редактировать
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>

    <BaseModal
      v-model="modalOpen"
      :title="isEdit ? 'Редактирование товара' : 'Новый товар'"
      size="md"
      @close="closeModal"
    >
      <div class="form-grid">
        <BaseInput v-model="form.name" label="Название" class="form-grid__full" />
        <BaseInput
          v-model="form.description"
          label="Описание"
          class="form-grid__full"
        />
        <BaseInput v-model="form.price" label="Цена (коины)" type="number" />
        <BaseInput v-model="form.stock" label="Количество на складе" type="number" />
        <p class="form-hint">
          Фото: заглушка. Загрузка файла будет в следующей версии.
        </p>
      </div>
      <template #footer>
        <BaseButton variant="secondary" @click="closeModal">Отмена</BaseButton>
        <BaseButton variant="primary" @click="onSave">Сохранить</BaseButton>
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
  align-items: flex-start;
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

.page__empty {
  padding: $space-8;
  text-align: center;
  color: $color-text-muted;
  background: $color-bg-muted;
  border-radius: $radius-card;
}

.catalog {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: $space-4;
}

.product-card {
  display: flex;
  flex-direction: column;
  gap: $space-4;
  height: 100%;
}

.product-card__photo {
  @include flex-center;

  height: 120px;
  border-radius: $radius-md;
  background: $color-bg-muted;
  color: $color-text-muted;
}

.product-card__body {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  flex: 1;
}

.product-card__top {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: $space-2;
}

.product-card__name {
  margin: 0;
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.product-card__desc {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
  line-height: $line-height-base;
}

.product-card__meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-3;
  margin: 0;

  dt {
    margin: 0;
    font-size: $font-size-xs;
    color: $color-text-muted;
  }

  dd {
    margin: $space-1 0 0;
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-4;
}

.form-grid__full {
  grid-column: 1 / -1;
}

.form-hint {
  grid-column: 1 / -1;
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-muted;
}

@include media-tablet-down {
  .page {
    padding: $space-4;
  }

  .catalog {
    grid-template-columns: 1fr 1fr;
  }
}

@include media-phone {
  .catalog,
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
