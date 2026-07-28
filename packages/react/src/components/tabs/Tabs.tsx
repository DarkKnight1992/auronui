import { useEffect, useMemo, useRef, useState, type Key, type ReactNode } from "react";
import { Tabs as RACTabs } from "react-aria-components";
import { tabsVariants, type TabsVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { TabsProvider } from "./tabs.context";
import { TabList } from "./TabList";
import { Tab } from "./Tab";
import { TabPanel } from "./TabPanel";

type TabShorthandItem = {
  value: string;
  label: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
  className?: ClassValue;
  classNames?: Partial<{ tab: ClassValue }>;
  panelClassName?: ClassValue;
  panelClassNames?: Partial<{ tabPanel: ClassValue }>;
};

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  variant?: TabsVariants["variant"];
  color?: TabsVariants["color"];
  /**
   * When false, horizontal tabs shrink to fit their own text instead of
   * stretching evenly across the full width. Has no effect on vertical
   * tabs, which fill the sidebar width by design.
   * @default true
   */
  fullWidth?: boolean;
  /**
   * Only meaningful combined with `fullWidth={false}`: keeps the track — the
   * pill background on the primary variant, the bottom border on the
   * secondary variant — spanning the full width, while the tabs inside it
   * still shrink to their own text.
   * @default false
   */
  trackFullWidth?: boolean;
  /** Whether tabs activate automatically on arrow-key focus, or require Enter/Space ("manual"). */
  activationMode?: "automatic" | "manual";
  className?: ClassValue;
  /** Override classes for individual slots */
  classNames?: Partial<{ base: ClassValue; tabList: ClassValue }>;
  /** Shorthand API: render tabs from an array instead of the compound slot API */
  items?: TabShorthandItem[];
  children?: ReactNode;
}

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  variant = "primary",
  color = "primary",
  fullWidth = true,
  trackFullWidth = false,
  activationMode = "automatic",
  className,
  classNames,
  items,
  children,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState<string | undefined>(
    value ?? defaultValue ?? items?.[0]?.value,
  );

  useEffect(() => {
    if (value !== undefined) setInternalValue(value);
  }, [value]);

  function changeTab(next: Key): void {
    const nextValue = String(next);
    setInternalValue(nextValue);
    onValueChange?.(nextValue);
  }

  const slotFns = useMemo(
    () => tabsVariants({ variant, color, fullWidth, trackFullWidth }),
    [variant, color, fullWidth, trackFullWidth],
  );
  const tabListRef = useRef<HTMLDivElement | null>(null);

  return (
    <TabsProvider value={{ slotFns, orientation, tabListRef }}>
      <RACTabs
        selectedKey={internalValue}
        onSelectionChange={changeTab}
        orientation={orientation}
        keyboardActivation={activationMode}
        data-orientation={orientation}
        className={composeClassName(slotFns.base(), className, classNames?.base)}
      >
        {items ? (
          <>
            <TabList classNames={{ tabList: classNames?.tabList }}>
              {items.map((item) => (
                <Tab
                  key={item.value}
                  value={item.value}
                  isDisabled={item.disabled}
                  className={item.className}
                  classNames={item.classNames}
                >
                  {item.label}
                </Tab>
              ))}
            </TabList>
            {items.map((item) => (
              <TabPanel
                key={item.value}
                value={item.value}
                className={item.panelClassName}
                classNames={item.panelClassNames}
              >
                {item.content}
              </TabPanel>
            ))}
          </>
        ) : (
          children
        )}
      </RACTabs>
    </TabsProvider>
  );
}
