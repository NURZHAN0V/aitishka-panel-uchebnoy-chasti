<script setup>
import { RouterLink } from 'vue-router'
import AppLayout from '@/core/layouts/AppLayout.vue'
import { BaseIcon } from '@/core/components/ui'
import { DASHBOARD_COUNTERS } from '@/modules/home/constants/dashboard.js'
</script>

<template>
  <AppLayout greeting active-route="home">
    <div class="page">
      <header class="page__header">
        <h1 class="page__title">Сводка</h1>
        <p class="page__subtitle">Задачи, требующие внимания учебной части</p>
      </header>

      <section class="counters" aria-label="Счётчики задач">
        <RouterLink
          v-for="item in DASHBOARD_COUNTERS"
          :key="item.id"
          :to="item.href"
          class="counter-tile"
        >
          <span class="counter-tile__icon" aria-hidden="true">
            <BaseIcon :name="item.icon" :size="22" />
          </span>
          <span class="counter-tile__label">{{ item.label }}</span>
          <span class="counter-tile__count">{{ item.count }}</span>
        </RouterLink>
      </section>
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use 'sass:color';
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

.counters {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: $space-4;
}

.counter-tile {
  @include card-surface;
  @include press-scale(0.97);

  display: flex;
  flex-direction: column;
  gap: $space-2;
  padding: $space-4;
  min-height: 132px;
  text-decoration: none;
  color: inherit;
  transition:
    transform $transition-press,
    border-color $transition-base,
    background-color $transition-base;

  &:hover {
    border-color: $color-primary-muted;
    background-color: color.mix($color-primary-light, $color-bg-card, 35%);
  }

  &:focus-visible {
    @include focus-ring;
  }

  &__icon {
    @include flex-center;

    width: 40px;
    height: 40px;
    border-radius: $radius-md;
    background: $color-primary-light;
    color: $color-primary;
  }

  &__label {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-secondary;
    line-height: $line-height-tight;
  }

  &__count {
    margin-top: auto;
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    line-height: $line-height-tight;
  }
}

@include media-tablet-down {
  .page {
    padding: $space-4;
  }

  .counters {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@include media-phone {
  .counters {
    grid-template-columns: 1fr;
  }
}
</style>
