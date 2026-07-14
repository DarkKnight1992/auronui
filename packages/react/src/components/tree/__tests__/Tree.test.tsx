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
