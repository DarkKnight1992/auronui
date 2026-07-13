import { computed, onMounted, onUnmounted, ref, watch, type ComputedRef, type Ref } from 'vue'
import { useFormInject } from './form.context'
import { runValidation } from './validation'
import type { FieldRules } from './validation'

export interface FieldArrayOptions<T extends Record<string, unknown> = Record<string, unknown>> {
  defaultValue?: T[]
  /** Row-count rules — evaluated against the array of row ids, so `required`/`minLength`/`maxLength` behave exactly as they do for any other array-valued field. */
  rules?: FieldRules
}

export interface FieldArrayRow<T extends Record<string, unknown> = Record<string, unknown>> {
  id: string
  /** Display-only position. Never use as a :key or pass to fieldName() — use `id` for both; index shifts on reorder, id never does. */
  index: number
  /** The value this row was seeded with (via defaultValue, append, prepend, insert, or replace) — bind each cell's FormField :default-value to a key of this. */
  defaultValue: T
}

export interface FieldArrayHandle<T extends Record<string, unknown> = Record<string, unknown>> {
  fields: ComputedRef<FieldArrayRow<T>[]>
  /** Builds the dotted field name for a cell in a row: fieldName(row.id, 'email') -> "contacts.contacts-row-0.email" */
  fieldName(id: string, key: string): string
  append(value?: Partial<T>): void
  prepend(value?: Partial<T>): void
  insert(index: number, value?: Partial<T>): void
  remove(id: string): void
  move(fromIndex: number, toIndex: number): void
  swap(indexA: number, indexB: number): void
  replace(values: T[]): void
  error: ComputedRef<string | undefined>
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

export function useFieldArray<T extends Record<string, unknown> = Record<string, unknown>>(
  name: string,
  options: FieldArrayOptions<T> = {},
): FieldArrayHandle<T> {
  const ctx = useFormInject()

  let rowCounter = 0
  function nextId(): string {
    return `${name}-row-${rowCounter++}`
  }

  const resolvedDefault = computed<T[]>(() => {
    if (options.defaultValue !== undefined) return options.defaultValue
    const fromCtx = ctx?.defaultValues[name]
    return Array.isArray(fromCtx) ? (fromCtx as T[]) : []
  })

  // Row ids in current display order — the single source of truth for both
  // rendering (`fields`) and nested value assembly in form.state.ts.
  const order: Ref<string[]> = ref([])
  const rowDefaults = new Map<string, T>()
  let initialOrderSnapshot: string[] = []

  function seedRows(initial: T[]): void {
    rowCounter = 0
    rowDefaults.clear()
    const ids: string[] = []
    for (const value of initial) {
      const id = nextId()
      ids.push(id)
      rowDefaults.set(id, value)
    }
    order.value = ids
    initialOrderSnapshot = ids
  }

  seedRows(resolvedDefault.value)

  const fields = computed<FieldArrayRow<T>[]>(() =>
    order.value.map((id, index) => ({
      id,
      index,
      defaultValue: rowDefaults.get(id) ?? ({} as T),
    })),
  )

  function fieldName(id: string, key: string): string {
    return `${name}.${id}.${key}`
  }

  async function validateStandalone(): Promise<void> {
    if (ctx) return
    localError.value = await runValidation(order.value.slice(), options.rules, undefined)
  }

  function append(value?: Partial<T>): void {
    const id = nextId()
    rowDefaults.set(id, (value ?? {}) as T)
    order.value = [...order.value, id]
    void validateStandalone()
  }

  function prepend(value?: Partial<T>): void {
    const id = nextId()
    rowDefaults.set(id, (value ?? {}) as T)
    order.value = [id, ...order.value]
    void validateStandalone()
  }

  function insert(index: number, value?: Partial<T>): void {
    const id = nextId()
    rowDefaults.set(id, (value ?? {}) as T)
    const next = [...order.value]
    next.splice(index, 0, id)
    order.value = next
    void validateStandalone()
  }

  function remove(id: string): void {
    order.value = order.value.filter((rowId) => rowId !== id)
    rowDefaults.delete(id)
    void validateStandalone()
  }

  function move(fromIndex: number, toIndex: number): void {
    const next = [...order.value]
    const [moved] = next.splice(fromIndex, 1)
    if (moved === undefined) return
    next.splice(toIndex, 0, moved)
    order.value = next
  }

  function swap(indexA: number, indexB: number): void {
    const next = [...order.value]
    const a = next[indexA]
    const b = next[indexB]
    if (a === undefined || b === undefined) return
    next[indexA] = b
    next[indexB] = a
    order.value = next
  }

  function replace(values: T[]): void {
    seedRows(values)
    void validateStandalone()
  }

  function resetFieldArray(): void {
    seedRows(resolvedDefault.value)
  }

  // ── Array-level validation ────────────────────────────────────────────────
  // Registered as an ordinary field so it rides the existing trigger()/
  // handleSubmit() validation loop for free. Its "value" is the array of row
  // ids (not a bare count) so required/minLength/maxLength behave exactly as
  // they already do for any other array-valued field in validation.ts.

  const localError = ref<string | undefined>(undefined)
  const dirty = ref(false)
  watch(order, () => {
    dirty.value = !arraysEqual(order.value, initialOrderSnapshot)
  })

  onMounted(() => {
    ctx?.registerField({
      name,
      valueRef: order as unknown as Ref<unknown>,
      getValue: () => order.value.slice(),
      getDefaultValue: () => resolvedDefault.value,
      setValue: () => {}, // structural mutations go through append/remove/etc., not setValue
      reset: () => {}, // reset is driven by registerFieldArray below (also resets rows/ids)
      touched: ref(false),
      dirty,
      rules: options.rules,
    })

    ctx?.registerFieldArray({
      name,
      order,
      reset: resetFieldArray,
    })
  })

  onUnmounted(() => {
    ctx?.unregisterField(name)
    ctx?.unregisterFieldArray(name)
  })

  const error = computed<string | undefined>(() =>
    ctx ? ctx.errors.value[name] : localError.value,
  )

  return {
    fields,
    fieldName,
    append,
    prepend,
    insert,
    remove,
    move,
    swap,
    replace,
    error,
  }
}
