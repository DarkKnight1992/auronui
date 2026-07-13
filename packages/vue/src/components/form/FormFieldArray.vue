<script setup lang="ts">
import { useFieldArray } from './useFieldArray'
import type { FieldRules } from './validation'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  name: string
  defaultValue?: Record<string, unknown>[]
  /** Row-count rules (required/minLength/maxLength/min/max) — evaluated against the array of rows. */
  rules?: FieldRules
}>()

const fieldArray = useFieldArray(props.name, {
  defaultValue: props.defaultValue,
  rules: props.rules,
})
</script>

<template>
  <slot
    :fields="fieldArray.fields.value"
    :field-name="fieldArray.fieldName"
    :append="fieldArray.append"
    :prepend="fieldArray.prepend"
    :insert="fieldArray.insert"
    :remove="fieldArray.remove"
    :move="fieldArray.move"
    :swap="fieldArray.swap"
    :replace="fieldArray.replace"
    :error="fieldArray.error.value"
  />
</template>
