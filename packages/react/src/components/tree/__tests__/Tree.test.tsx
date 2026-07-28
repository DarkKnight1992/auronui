import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Tree } from "../Tree";
import { TreeItem } from "../TreeItem";
import { TreeItemToggle } from "../TreeItemToggle";

interface FileNode {
  id: string;
  label: string;
  children?: FileNode[];
}

const fileTree: FileNode[] = [
  {
    id: "src",
    label: "src",
    children: [
      { id: "main.ts", label: "main.ts" },
      { id: "app.tsx", label: "App.tsx" },
    ],
  },
  { id: "package.json", label: "package.json" },
];

function TestTree({
  defaultExpanded,
  onSelect,
  onToggle,
}: {
  defaultExpanded?: string[];
  onSelect?: (key: string) => void;
  onToggle?: (key: string) => void;
}) {
  return (
    <Tree items={fileTree} getKey={(i) => i.id} getChildren={(i) => i.children} defaultExpanded={defaultExpanded}>
      {({ flattenItems }) =>
        flattenItems.map((fi) => (
          <TreeItem
            key={fi.key}
            value={fi.item}
            itemKey={fi.key}
            level={fi.level}
            onSelect={() => onSelect?.(fi.key)}
            onToggle={() => onToggle?.(fi.key)}
          >
            {({ isExpanded, hasChildren, toggleClass }) => (
              <>
                <TreeItemToggle isExpanded={isExpanded} hasChildren={hasChildren} className={toggleClass} />
                <span>{fi.item.label}</span>
              </>
            )}
          </TreeItem>
        ))
      }
    </Tree>
  );
}

describe("Tree", () => {
  it("renders root-level items, nested children hidden until expanded", () => {
    render(<TestTree />);
    expect(screen.getAllByRole("treeitem")).toHaveLength(2);
    expect(screen.queryByText("main.ts")).not.toBeInTheDocument();
  });

  it("defaultExpanded reveals nested children as additional rows", () => {
    render(<TestTree defaultExpanded={["src"]} />);
    expect(screen.getAllByRole("treeitem")).toHaveLength(4);
    expect(screen.getByText("main.ts")).toBeInTheDocument();
  });

  it("click fires both select and toggle for a node with children", async () => {
    const onSelect = vi.fn();
    const onToggle = vi.fn();
    render(<TestTree onSelect={onSelect} onToggle={onToggle} />);
    await userEvent.click(screen.getByText("src"));
    expect(onSelect).toHaveBeenCalledWith("src");
    expect(onToggle).toHaveBeenCalledWith("src");
  });

  it("keyboard Enter fires both select and toggle symmetrically with click (parity fix)", async () => {
    const onSelect = vi.fn();
    const onToggle = vi.fn();
    render(<TestTree onSelect={onSelect} onToggle={onToggle} />);
    const srcRow = screen.getByText("src").closest('[role="treeitem"]') as HTMLElement;
    srcRow.focus();
    await userEvent.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith("src");
    expect(onToggle).toHaveBeenCalledWith("src");
  });

  it("keyboard Space also fires both select and toggle", async () => {
    const onSelect = vi.fn();
    const onToggle = vi.fn();
    render(<TestTree onSelect={onSelect} onToggle={onToggle} />);
    const srcRow = screen.getByText("src").closest('[role="treeitem"]') as HTMLElement;
    srcRow.focus();
    await userEvent.keyboard(" ");
    expect(onSelect).toHaveBeenCalledWith("src");
    expect(onToggle).toHaveBeenCalledWith("src");
  });

  it("toggling expansion actually reveals/hides children rows", async () => {
    function Controlled() {
      const [expanded, setExpanded] = useState<string[]>([]);
      return (
        <Tree
          items={fileTree}
          getKey={(i) => i.id}
          getChildren={(i) => i.children}
          expanded={expanded}
          onExpandedChange={setExpanded}
        >
          {({ flattenItems }) =>
            flattenItems.map((fi) => (
              <TreeItem key={fi.key} value={fi.item} itemKey={fi.key} level={fi.level}>
                {({ isExpanded, hasChildren, toggleClass }) => (
                  <>
                    <TreeItemToggle isExpanded={isExpanded} hasChildren={hasChildren} className={toggleClass} />
                    <span>{fi.item.label}</span>
                  </>
                )}
              </TreeItem>
            ))
          }
        </Tree>
      );
    }
    render(<Controlled />);
    expect(screen.queryByText("main.ts")).not.toBeInTheDocument();
    await userEvent.click(screen.getByText("src"));
    expect(screen.getByText("main.ts")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TestTree defaultExpanded={["src"]} />);
    const results = await axe.run(container);
    expect(results).toHaveNoViolations();
  });
});

describe("Tree keyboard navigation (WAI-ARIA TreeView pattern)", () => {
  function rows() {
    return screen.getAllByRole("treeitem");
  }

  it("aria-level reflects 1-indexed depth", () => {
    render(<TestTree defaultExpanded={["src"]} />);
    const [src, mainTs, appTsx, pkg] = rows();
    expect(src).toHaveAttribute("aria-level", "1");
    expect(mainTs).toHaveAttribute("aria-level", "2");
    expect(appTsx).toHaveAttribute("aria-level", "2");
    expect(pkg).toHaveAttribute("aria-level", "1");
  });

  it("roving tabindex: only one row is a tab stop at a time, defaulting to the first row", () => {
    render(<TestTree defaultExpanded={["src"]} />);
    const [src, mainTs, appTsx, pkg] = rows();
    expect(src).toHaveAttribute("tabindex", "0");
    expect(mainTs).toHaveAttribute("tabindex", "-1");
    expect(appTsx).toHaveAttribute("tabindex", "-1");
    expect(pkg).toHaveAttribute("tabindex", "-1");
  });

  it("clicking a row moves the roving tabindex to that row", async () => {
    render(<TestTree defaultExpanded={["src"]} />);
    const [src, , , pkg] = rows();
    await userEvent.click(pkg!);
    expect(pkg).toHaveAttribute("tabindex", "0");
    expect(src).toHaveAttribute("tabindex", "-1");
  });

  it("ArrowDown moves focus (and the roving tabindex) to the next visible row", async () => {
    render(<TestTree defaultExpanded={["src"]} />);
    const [src, mainTs] = rows();
    src!.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(mainTs).toHaveFocus();
    expect(mainTs).toHaveAttribute("tabindex", "0");
    expect(src).toHaveAttribute("tabindex", "-1");
  });

  it("ArrowDown on the last row is a no-op", async () => {
    render(<TestTree defaultExpanded={["src"]} />);
    const allRows = rows();
    const pkg = allRows[allRows.length - 1]!;
    pkg.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(pkg).toHaveFocus();
  });

  it("ArrowUp moves focus to the previous visible row", async () => {
    render(<TestTree defaultExpanded={["src"]} />);
    const [src, mainTs] = rows();
    mainTs!.focus();
    await userEvent.keyboard("{ArrowUp}");
    expect(src).toHaveFocus();
    expect(src).toHaveAttribute("tabindex", "0");
  });

  it("ArrowUp on the first row is a no-op", async () => {
    render(<TestTree defaultExpanded={["src"]} />);
    const src = rows()[0]!;
    src.focus();
    await userEvent.keyboard("{ArrowUp}");
    expect(src).toHaveFocus();
  });

  it("ArrowRight on a collapsed node with children expands it (and fires onToggle) without moving focus", async () => {
    const onToggle = vi.fn();
    render(<TestTree onToggle={onToggle} />);
    const src = rows()[0]!;
    src.focus();
    expect(screen.queryByText("main.ts")).not.toBeInTheDocument();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByText("main.ts")).toBeInTheDocument();
    expect(onToggle).toHaveBeenCalledWith("src");
    expect(src).toHaveFocus();
  });

  it("ArrowRight on an already-expanded node moves focus into its first child", async () => {
    render(<TestTree defaultExpanded={["src"]} />);
    const [src, mainTs] = rows();
    src!.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(mainTs).toHaveFocus();
  });

  it("ArrowRight on a leaf row (no children) is a no-op", async () => {
    render(<TestTree defaultExpanded={["src"]} />);
    const allRows = rows();
    const pkg = allRows[allRows.length - 1]!; // package.json, no children
    pkg.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(pkg).toHaveFocus();
  });

  it("ArrowLeft on an expanded node collapses it (and fires onToggle) without moving focus", async () => {
    const onToggle = vi.fn();
    render(<TestTree defaultExpanded={["src"]} onToggle={onToggle} />);
    const src = rows()[0]!;
    src.focus();
    expect(screen.getByText("main.ts")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.queryByText("main.ts")).not.toBeInTheDocument();
    expect(onToggle).toHaveBeenCalledWith("src");
    expect(src).toHaveFocus();
  });

  it("ArrowLeft on a child row moves focus out to its parent", async () => {
    render(<TestTree defaultExpanded={["src"]} />);
    const [src, mainTs] = rows();
    mainTs!.focus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(src).toHaveFocus();
  });

  it("ArrowLeft on a collapsed root row is a no-op (no parent to move to)", async () => {
    render(<TestTree />);
    const src = rows()[0]!;
    src.focus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(src).toHaveFocus();
  });

  it("Enter/Space selection and toggling still work alongside arrow-key navigation", async () => {
    const onSelect = vi.fn();
    const onToggle = vi.fn();
    render(<TestTree onSelect={onSelect} onToggle={onToggle} />);
    const src = rows()[0]!;
    src.focus();
    await userEvent.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith("src");
    expect(onToggle).toHaveBeenCalledWith("src");
  });
});
