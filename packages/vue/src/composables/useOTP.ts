import { ref, computed, readonly, type Ref, type ComputedRef } from 'vue'

export interface UseOTPOptions {
  /** Number of OTP slots. Defaults to 6. */
  length?: number
  /** Initial OTP value string. */
  defaultValue?: string
  /** Fires on every keystroke with the current value. */
  onChange?: (value: string) => void
  /** Fires when all slots are filled. */
  onComplete?: (value: string) => void
}

export interface UseOTPReturn {
  /** The current OTP value string. */
  value: Readonly<Ref<string>>
  /** True when the value length equals the configured length. */
  isComplete: ComputedRef<boolean>
  /** Clear the OTP value. */
  reset: () => void
  /** Pass as `@update:model-value` on the InputOTP component. */
  onValueChange: (value: string) => void
  /** Pass as `@complete` on the InputOTP component. */
  onOTPComplete: (value: string) => void
}

export function useOTP(options: UseOTPOptions = {}): UseOTPReturn {
  const length = options.length ?? 6
  const _value = ref(options.defaultValue ?? '')

  const isComplete = computed(() => _value.value.length === length)

  function reset(): void {
    _value.value = ''
  }

  function onValueChange(value: string): void {
    _value.value = value
    options.onChange?.(value)
  }

  function onOTPComplete(value: string): void {
    _value.value = value
    options.onComplete?.(value)
  }

  return {
    value: readonly(_value),
    isComplete,
    reset,
    onValueChange,
    onOTPComplete,
  }
}
