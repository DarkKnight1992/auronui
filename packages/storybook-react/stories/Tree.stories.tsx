import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tree, TreeItem, TreeItemToggle } from "@auronui/react";

interface FileNode {
  id: string;
  label: string;
  icon?: "folder" | "file" | "image" | "config";
  children?: FileNode[];
}

const fileTree: FileNode[] = [
  {
    id: "src",
    label: "src",
    icon: "folder",
    children: [
      {
        id: "components",
        label: "components",
        icon: "folder",
        children: [
          { id: "button.tsx", label: "Button.tsx", icon: "file" },
          { id: "input.tsx", label: "Input.tsx", icon: "file" },
          { id: "modal.tsx", label: "Modal.tsx", icon: "file" },
        ],
      },
      {
        id: "utils",
        label: "utils",
        icon: "folder",
        children: [
          { id: "helpers.ts", label: "helpers.ts", icon: "file" },
          { id: "constants.ts", label: "constants.ts", icon: "file" },
        ],
      },
      { id: "main.tsx", label: "main.tsx", icon: "file" },
      { id: "app.tsx", label: "App.tsx", icon: "file" },
    ],
  },
  {
    id: "public",
    label: "public",
    icon: "folder",
    children: [{ id: "favicon.svg", label: "favicon.svg", icon: "image" }],
  },
  { id: "package.json", label: "package.json", icon: "config" },
  { id: "vite.config.ts", label: "vite.config.ts", icon: "config" },
];

const iconSvg: Record<string, string> = {
  folder: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
  file: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  image: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`,
  config: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
};

const meta: Meta<typeof Tree<FileNode>> = {
  title: "Extended/Tree",
  component: Tree,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    multiple: { control: "boolean" },
    isDisabled: { control: "boolean" },
  },
  args: {
    size: "md",
    multiple: false,
    isDisabled: false,
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 32, maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tree<FileNode>>;

export const Default: Story = {
  render: (args) => {
    function Demo() {
      const [selected, setSelected] = useState<string | string[] | undefined>(undefined);
      const [expanded, setExpanded] = useState<string[]>(["src", "components"]);
      return (
        <Tree
          {...args}
          items={fileTree}
          getKey={(item) => item.id}
          getChildren={(item) => item.children}
          selected={selected}
          onSelectionChange={setSelected}
          expanded={expanded}
          onExpandedChange={setExpanded}
          aria-label="File tree"
        >
          {({ flattenItems }) => (
            <>
              {flattenItems.map(({ key, item, level, hasChildren }) => (
                <TreeItem key={key} value={item} itemKey={key} level={level}>
                  {({ isExpanded, toggleClass, iconClass }) => (
                    <>
                      <TreeItemToggle isExpanded={isExpanded} hasChildren={hasChildren} className={toggleClass} />
                      <span className={iconClass} dangerouslySetInnerHTML={{ __html: iconSvg[item.icon || "file"] }} />
                      <span>{item.label}</span>
                    </>
                  )}
                </TreeItem>
              ))}
            </>
          )}
        </Tree>
      );
    }
    return <Demo />;
  },
};

export const SingleSelection: Story = {
  args: { size: "md", multiple: false },
  render: (args) => {
    function Demo() {
      const [selected, setSelected] = useState<string | string[] | undefined>(undefined);
      return (
        <div>
          <Tree
            {...args}
            items={fileTree}
            getKey={(item) => item.id}
            getChildren={(item) => item.children}
            selected={selected}
            onSelectionChange={setSelected}
            defaultExpanded={["src"]}
            aria-label="File tree single selection"
          >
            {({ flattenItems }) => (
              <>
                {flattenItems.map(({ key, item, level, hasChildren }) => (
                  <TreeItem key={key} value={item} itemKey={key} level={level}>
                    {({ isExpanded, toggleClass, iconClass }) => (
                      <>
                        <TreeItemToggle isExpanded={isExpanded} hasChildren={hasChildren} className={toggleClass} />
                        <span className={iconClass} dangerouslySetInnerHTML={{ __html: iconSvg[item.icon || "file"] }} />
                        <span>{item.label}</span>
                      </>
                    )}
                  </TreeItem>
                ))}
              </>
            )}
          </Tree>
          <p style={{ marginTop: 12, fontSize: 12, color: "#64748b", fontFamily: "sans-serif" }}>
            Selected: {typeof selected === "string" ? selected : "none"}
          </p>
        </div>
      );
    }
    return <Demo />;
  },
};

export const MultiSelection: Story = {
  args: { size: "md", multiple: true },
  render: (args) => {
    function Demo() {
      const [selected, setSelected] = useState<string | string[] | undefined>([]);
      return (
        <div>
          <Tree
            {...args}
            items={fileTree}
            getKey={(item) => item.id}
            getChildren={(item) => item.children}
            selected={selected}
            onSelectionChange={setSelected}
            defaultExpanded={["src", "components"]}
            aria-label="File tree multi selection"
          >
            {({ flattenItems }) => (
              <>
                {flattenItems.map(({ key, item, level, hasChildren }) => (
                  <TreeItem key={key} value={item} itemKey={key} level={level}>
                    {({ isExpanded, toggleClass, iconClass }) => (
                      <>
                        <TreeItemToggle isExpanded={isExpanded} hasChildren={hasChildren} className={toggleClass} />
                        <span className={iconClass} dangerouslySetInnerHTML={{ __html: iconSvg[item.icon || "file"] }} />
                        <span>{item.label}</span>
                      </>
                    )}
                  </TreeItem>
                ))}
              </>
            )}
          </Tree>
          <p style={{ marginTop: 12, fontSize: 12, color: "#64748b", fontFamily: "sans-serif" }}>
            Selected: {Array.isArray(selected) ? selected.join(", ") || "none" : "none"}
          </p>
        </div>
      );
    }
    return <Demo />;
  },
};

export const Sizes: Story = {
  render: () => {
    const simpleTree: FileNode[] = [
      {
        id: "root",
        label: "project",
        icon: "folder",
        children: [
          { id: "index", label: "index.ts", icon: "file" },
          { id: "config", label: "config.ts", icon: "config" },
        ],
      },
    ];
    return (
      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        {(["sm", "md", "lg"] as const).map((size) => (
          <div key={size}>
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontFamily: "sans-serif" }}>size=&quot;{size}&quot;</p>
            <Tree
              size={size}
              items={simpleTree}
              getKey={(item) => item.id}
              getChildren={(item) => item.children}
              defaultExpanded={["root"]}
              aria-label={`Tree size ${size}`}
            >
              {({ flattenItems }) => (
                <>
                  {flattenItems.map(({ key, item, level, hasChildren }) => (
                    <TreeItem key={key} value={item} itemKey={key} level={level}>
                      {({ isExpanded, toggleClass, iconClass }) => (
                        <>
                          <TreeItemToggle isExpanded={isExpanded} hasChildren={hasChildren} className={toggleClass} />
                          <span className={iconClass} dangerouslySetInnerHTML={{ __html: iconSvg[item.icon || "file"] }} />
                          <span>{item.label}</span>
                        </>
                      )}
                    </TreeItem>
                  ))}
                </>
              )}
            </Tree>
          </div>
        ))}
      </div>
    );
  },
};
