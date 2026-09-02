<script setup lang="ts">
import { computed, useAttrs, useSlots, type Component, type ComponentOptions } from 'vue'
import FormField from './FormField.vue'
import type { FieldRules, CustomValidator } from './validation'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  name: string
  /**
   * The control to render. A component, never a string tag — a bound field is
   * always one of the library's controls.
   */
  as: Component
  /**
   * Typed `unknown` on purpose. Declaring this `boolean` would compile to
   * `{ type: Boolean }`, and Vue casts an *absent* Boolean prop to `false`
   * rather than `undefined` — which would shadow the form-level default for
   * every control the consumer did not explicitly set. `unknown` compiles to
   * `{ type: null }`, which Vue never casts.
   */
  defaultValue?: unknown
  rules?: FieldRules
  validate?: CustomValidator
  validationMode?: 'on-submit' | 'on-blur' | 'on-change'
  deps?: string[]
}>()

const modelValue = defineModel<unknown>({ default: undefined })

const attrs = useAttrs()
const slots = useSlots()

interface BoundFieldProps {
  name: string
  modelValue: unknown
  'onUpdate:modelValue': (value: unknown) => Promise<void>
  isInvalid: boolean
  errorMessage: string | undefined
  isDisabled: boolean
  onBlur: () => Promise<void>
}

/**
 * Which props the target control actually declares. Bindings are filtered
 * through this because an undeclared prop falls through to `$attrs` and lands
 * on the DOM — binding `errorMessage` to a Checkbox would render
 * `errormessage="…"`. Tolerates a component with no `props` option, and the
 * array form (`['modelValue']`) a hand-written component may use.
 */
const declared = computed<Set<string>>(() => {
  const raw = (props.as as ComponentOptions | undefined)?.props
  if (Array.isArray(raw)) return new Set(raw as string[])
  if (raw && typeof raw === 'object') return new Set(Object.keys(raw))
  return new Set<string>()
})

function declares(name: string): boolean {
  return declared.value.has(name)
}

/**
 * Read a boolean the consumer passed through `$attrs`. These arrive unnormalised
 * because they are not declared props here — a bare `is-disabled` in a template
 * compiles to the empty string, not `true` — so Vue's own boolean-attribute rule
 * is applied by hand. Both casings are accepted, since the key depends on how
 * the consumer wrote it.
 */
function attrFlag(hyphenated: string, camel: string): boolean {
  for (const key of [camel, hyphenated]) {
    if (!(key in attrs)) continue
    const value = attrs[key]
    if (value === true || value === '' || value === key) return true
  }
  return false
}

function controlProps(fieldProps: BoundFieldProps): Record<string, unknown> {
  const bound: Record<string, unknown> = {
    modelValue: fieldProps.modelValue,
    'onUpdate:modelValue': fieldProps['onUpdate:modelValue'],
    // A listener, not a prop: every control sets inheritAttrs:false and
    // re-binds attrs onto its inner interactive element, so this reaches a
    // real blur — which is what validation-mode="on-blur" runs on.
    onBlur: fieldProps.onBlur,
  }

  if (declares('name')) bound.name = fieldProps.name
  if (declares('isInvalid')) bound.isInvalid = fieldProps.isInvalid
  if (declares('errorMessage')) bound.errorMessage = fieldProps.errorMessage
  if (declares('isDisabled')) {
    // OR-ed rather than ordered, so a form-level Form :is-disabled can never be
    // defeated by a per-control value, nor the reverse.
    bound.isDisabled = fieldProps.isDisabled || attrFlag('is-disabled', 'isDisabled')
  }

  return bound
}
</script>

<template>
  <FormField
    v-model="modelValue"
    :name="props.name"
    :default-value="props.defaultValue"
    :rules="props.rules"
    :validate="props.validate"
    :validation-mode="props.validationMode"
    :deps="props.deps"
  >
    <template #default="{ fieldProps }">
      <component
        :is="props.as"
        v-bind="{ ...attrs, ...controlProps(fieldProps as BoundFieldProps) }"
      >
        <template
          v-for="(_, slotName) in slots"
          #[slotName]="slotScope"
        >
          <slot
            :name="slotName"
            v-bind="slotScope ?? {}"
          />
        </template>
      </component>
    </template>
  </FormField>
</template>
