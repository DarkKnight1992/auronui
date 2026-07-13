<!--
  Statistic — single-number KPI/metric display: label + big value +
  optional prefix/suffix, description, and trend indicator.

  Pure presentational, no Reka UI primitive involved — matches the
  complexity level of Meter/ProgressBar, not a compound component.
  Loading state reuses the existing Skeleton component.
-->
<script setup lang="ts">
import { computed } from 'vue'
import { statisticVariants, type StatisticVariants } from '@auronui/styles'
import { composeClassName, type ClassValue } from '../../utils/composeClassName'
import Skeleton from '../skeleton/Skeleton.vue'

const props = withDefaults(
  defineProps<{
    label: string
    value: string | number
    prefix?: string
    suffix?: string
    description?: string
    /** Decimal places applied when `value` is a number. */
    precision?: number
    isLoading?: boolean
    color?: StatisticVariants['color']
    trend?: 'up' | 'down' | 'neutral'
    trendValue?: string
    class?: ClassValue
    classNames?: Partial<{
      base: ClassValue
      label: ClassValue
      valueWrapper: ClassValue
      value: ClassValue
      affix: ClassValue
      description: ClassValue
      trend: ClassValue
    }>
  }>(),
  {
    prefix: undefined,
    suffix: undefined,
    description: undefined,
    precision: undefined,
    isLoading: false,
    color: 'default',
    trend: undefined,
    trendValue: undefined,
    class: undefined,
    classNames: undefined,
  },
)

const formattedValue = computed(() => {
  if (typeof props.value === 'number' && props.precision !== undefined) {
    return props.value.toFixed(props.precision)
  }
  return String(props.value)
})

const slotFns = computed(() => statisticVariants({ color: props.color }))
</script>

<template>
  <div
    :class="composeClassName(slotFns.base(), props.class, props.classNames?.base)"
    data-slot="statistic"
  >
    <span
      :class="composeClassName(slotFns.label(), props.classNames?.label)"
      data-slot="statistic-label"
    >{{ label }}</span>

    <Skeleton v-if="isLoading">
      <div style="height: 2.25rem; width: 6rem; border-radius: 0.375rem;" />
    </Skeleton>
    <div
      v-else
      :class="composeClassName(slotFns.valueWrapper(), props.classNames?.valueWrapper)"
      data-slot="statistic-value-wrapper"
    >
      <span
        v-if="prefix"
        :class="composeClassName(slotFns.affix(), props.classNames?.affix)"
        data-slot="statistic-prefix"
      >{{ prefix }}</span>
      <span
        :class="composeClassName(slotFns.value(), props.classNames?.value)"
        data-slot="statistic-value"
      >{{ formattedValue }}</span>
      <span
        v-if="suffix"
        :class="composeClassName(slotFns.affix(), props.classNames?.affix)"
        data-slot="statistic-suffix"
      >{{ suffix }}</span>
      <span
        v-if="trend"
        :class="composeClassName(slotFns.trend(), props.classNames?.trend)"
        data-slot="statistic-trend"
        :data-trend="trend"
      >
        <svg
          v-if="trend === 'up'"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        ><path d="M7 17 17 7M7 7h10v10" /></svg>
        <svg
          v-else-if="trend === 'down'"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        ><path d="M7 7 17 17M17 7v10H7" /></svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        ><path d="M5 12h14" /></svg>
        <span v-if="trendValue">{{ trendValue }}</span>
      </span>
    </div>

    <span
      v-if="description"
      :class="composeClassName(slotFns.description(), props.classNames?.description)"
      data-slot="statistic-description"
    >{{ description }}</span>
  </div>
</template>
