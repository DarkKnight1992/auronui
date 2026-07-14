import { useRef, type ReactNode } from "react";
import { collapsibleGroupVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import {
  CollapsibleGroupProvider,
  type CollapsibleGroupContextValue,
  type CollapsibleGroupRegistryEntry,
} from "./collapsible-group.context";
import { Collapsible } from "./Collapsible";
import { CollapsibleTrigger } from "./CollapsibleTrigger";
import { CollapsibleContent } from "./CollapsibleContent";

type CollapsibleShorthandItem = {
  title: ReactNode;
  content?: ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
};

export interface CollapsibleGroupProps {
  /** When true, only one child Collapsible can be open at a time. */
  singleOpen?: boolean;
  className?: ClassValue;
  /** Override classes for individual slots */
  classNames?: Partial<{
    base: ClassValue;
    trigger: ClassValue;
    indicator: ClassValue;
    body: ClassValue;
    bodyInner: ClassValue;
  }>;
  /** Shorthand API: render collapsibles from an array instead of the compound slot API */
  items?: CollapsibleShorthandItem[];
  children?: ReactNode;
}

export function CollapsibleGroup({
  singleOpen = false,
  className,
  classNames,
  items,
  children,
}: CollapsibleGroupProps) {
  const registryRef = useRef(new Map<string, CollapsibleGroupRegistryEntry>());
  const allowMultipleRef = useRef(!singleOpen);
  allowMultipleRef.current = !singleOpen;

  const ctxRef = useRef<CollapsibleGroupContextValue>({
    get allowMultiple() {
      return allowMultipleRef.current;
    },
    register(entry) {
      registryRef.current.set(entry.id, entry);
    },
    unregister(id) {
      registryRef.current.delete(id);
    },
    notifyOpen(openingId) {
      if (allowMultipleRef.current) return;
      for (const [id, entry] of registryRef.current) {
        if (id !== openingId) entry.close();
      }
    },
  });

  const slotFns = collapsibleGroupVariants({});

  return (
    <CollapsibleGroupProvider value={ctxRef.current}>
      <div className={composeClassName(slotFns.base(), className, classNames?.base)}>
        {items
          ? items.map((item, idx) => (
              <Collapsible key={idx} defaultOpen={item.defaultOpen} isDisabled={item.disabled}>
                <CollapsibleTrigger
                  classNames={{ trigger: classNames?.trigger, indicator: classNames?.indicator }}
                >
                  {item.title}
                </CollapsibleTrigger>
                <CollapsibleContent
                  classNames={{ body: classNames?.body, bodyInner: classNames?.bodyInner }}
                >
                  {item.content}
                </CollapsibleContent>
              </Collapsible>
            ))
          : children}
      </div>
    </CollapsibleGroupProvider>
  );
}
