import { sidebarVariants } from "@auronui/styles";
import { composeClassName, type ClassValue } from "../../utils";
import { useSidebarContext, sidebarContextDefaults } from "./sidebar.context";
import { Input } from "../input/Input";

export interface SidebarSearchProps {
  placeholder?: string;
  classNames?: Partial<{ search: ClassValue }>;
}

export function SidebarSearch({ placeholder = "Search", classNames }: SidebarSearchProps) {
  const ctx = useSidebarContext(sidebarContextDefaults);
  const styles = sidebarVariants();

  return (
    <div className={composeClassName(styles.search(), classNames?.search)}>
      <Input
        type="search"
        variant="bordered"
        value={ctx.searchQuery}
        onChange={(e) => ctx.setSearchQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search sidebar links"
      />
    </div>
  );
}
