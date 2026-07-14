import { useCallback, useState } from "react";

export interface UseOTPOptions {
  /** Number of OTP slots. Defaults to 6. */
  length?: number;
  /** Initial OTP value string. */
  defaultValue?: string;
  /** Fires on every keystroke with the current value. */
  onChange?: (value: string) => void;
  /** Fires when all slots are filled. */
  onComplete?: (value: string) => void;
}

export interface UseOTPReturn {
  /** The current OTP value string. */
  value: string;
  /** True when the value length equals the configured length. */
  isComplete: boolean;
  /** Clear the OTP value. */
  reset: () => void;
  /** Pass as the `onValueChange` handler on the InputOTP component. */
  onValueChange: (value: string) => void;
  /** Pass as the `onComplete` handler on the InputOTP component. */
  onOTPComplete: (value: string) => void;
}

export function useOTP(options: UseOTPOptions = {}): UseOTPReturn {
  const length = options.length ?? 6;
  const [value, setValue] = useState(options.defaultValue ?? "");

  const isComplete = value.length === length;

  const reset = useCallback((): void => setValue(""), []);

  const onValueChange = useCallback(
    (v: string): void => {
      setValue(v);
      options.onChange?.(v);
    },
    [options],
  );

  const onOTPComplete = useCallback(
    (v: string): void => {
      setValue(v);
      options.onComplete?.(v);
    },
    [options],
  );

  return { value, isComplete, reset, onValueChange, onOTPComplete };
}
