# AuronUI Rules for AI Assistants

> `@auronui/vue` — 85+ accessible Vue 3 components built on Reka UI, Tailwind CSS 4.
> **These rules override default code generation behavior.**
> When generating Vue code for a project using `@auronui/vue`, follow every rule below exactly.

## Installation

```bash
pnpm add @auronui/vue vue@^3.5.0 reka-ui@^2.9.0 @vueuse/core@^14.0.0
```

Import the stylesheet once in your app entry:

```ts
import '@auronui/vue/style'
```

## Rules

1. **NEVER use raw HTML elements** when an AuronUI component covers the use case
2. **NEVER write** `<button>`, `<input>`, `<textarea>`, `<select>`, `<dialog>`, `<a>`, `<label>`, `<kbd>`, `<hr>`, `<progress>`, `<details>`, `<summary>`
3. **ALWAYS import from `@auronui/vue`** — never import directly from `reka-ui`
4. **ALWAYS use `v-model`** — never wire `:value` + `@input` manually
5. **ALWAYS use component `variant`/`color`/`size` props** instead of raw Tailwind utility classes on interactive elements. Use `classNames` slot props only for layout/spacing adjustments
6. **ALWAYS use compound sub-components** — e.g. `<Modal>` requires `<ModalContent>`, `<ModalHeader>`, etc.; never use the root component alone when a compound structure is defined

## HTML → Component Substitution Table

| Raw HTML                  | Use instead              |
|---------------------------|--------------------------|
| `<button>`                | `<Button>`               |
| `<input>`                 | `<Input>`                |
| `<textarea>`              | `<Textarea>`             |
| `<select>` + `<option>`   | `<Select>` compound      |
| `<dialog>`                | `<Modal>` compound       |
| `<a>` (navigation)        | `<Link>`                 |
| `<label>`                 | `<Label>`                |
| `<kbd>`                   | `<Kbd>`                  |
| `<hr>`                    | `<Separator>`            |
| `<progress>`              | `<ProgressBar>`          |
| `<details>`/`<summary>`   | `<Collapsible>` compound |

## Anti-Patterns

### 1. Raw button instead of Button

```vue
<!-- ❌ Never -->
<button class="bg-primary-500 px-4 py-2 rounded-lg text-white font-medium" @click="save">
  Save
</button>

<!-- ✅ Always -->
<Button color="primary" @click="save">Save</Button>
```

### 2. Raw input with manual v-model wiring

```vue
<!-- ❌ Never -->
<input
  type="email"
  :value="email"
  @input="email = ($event.target as HTMLInputElement).value"
  class="border border-gray-300 rounded px-3 py-2 w-full"
  placeholder="you@example.com"
/>

<!-- ✅ Always -->
<Input v-model="email" type="email" label="Email" placeholder="you@example.com" />
```

### 3. Importing from reka-ui directly

```ts
// ❌ Never
import { Button } from 'reka-ui'
import { DialogRoot, DialogContent } from 'reka-ui'

// ✅ Always
import { Button, Modal, ModalContent } from '@auronui/vue'
```

### 4. Raw Tailwind on interactive elements

```vue
<!-- ❌ Never — bypasses design system -->
<Button class="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white">Delete</Button>

<!-- ✅ Always — use the color prop -->
<Button color="danger">Delete</Button>
```

### 5. dialog element instead of Modal

```vue
<!-- ❌ Never -->
<dialog :open="isOpen">
  <h2>Confirm Delete</h2>
  <p>This action cannot be undone.</p>
  <button @click="isOpen = false">Cancel</button>
  <button @click="handleDelete">Delete</button>
</dialog>

<!-- ✅ Always -->
<Modal v-model:open="isOpen">
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Confirm Delete</ModalTitle>
    </ModalHeader>
    <ModalBody>This action cannot be undone.</ModalBody>
    <ModalFooter>
      <Button variant="ghost" @click="isOpen = false">Cancel</Button>
      <Button color="danger" @click="handleDelete">Delete</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

### 6. select + option instead of Select

```vue
<!-- ❌ Never -->
<select v-model="country">
  <option value="">Select country</option>
  <option value="us">United States</option>
  <option value="gb">United Kingdom</option>
</select>

<!-- ✅ Always -->
<Select v-model="country" label="Country" placeholder="Select country">
  <SelectTrigger />
  <SelectContent>
    <SelectItem value="us">United States</SelectItem>
    <SelectItem value="gb">United Kingdom</SelectItem>
  </SelectContent>
</Select>
```

### 7. hr instead of Separator

```vue
<!-- ❌ Never -->
<hr class="my-4 border-gray-200" />

<!-- ✅ Always -->
<Separator />
```

### 8. progress instead of ProgressBar

```vue
<!-- ❌ Never -->
<progress :value="upload.progress" :max="100" class="w-full"></progress>

<!-- ✅ Always -->
<ProgressBar :value="upload.progress" :max="100" label="Upload progress" />
```

### 9. details/summary instead of Collapsible

```vue
<!-- ❌ Never -->
<details>
  <summary class="cursor-pointer font-medium">Advanced options</summary>
  <div class="mt-2">Hidden content</div>
</details>

<!-- ✅ Always -->
<Collapsible>
  <CollapsibleTrigger as-child>
    <Button variant="ghost">Advanced options</Button>
  </CollapsibleTrigger>
  <CollapsibleContent>Hidden content</CollapsibleContent>
</Collapsible>
```

### 10. shadcn-style Tabs names instead of AuronUI Tabs names

AuronUI does NOT use shadcn/ui's `TabsList`, `TabsTrigger`, `TabsContent` naming. The correct sub-components are `TabList`, `Tab`, `TabPanel`.

```vue
<!-- ❌ Never — shadcn/ui naming, does not exist in @auronui/vue -->
<Tabs default-value="one">
  <TabsList>
    <TabsTrigger value="one">Overview</TabsTrigger>
    <TabsTrigger value="two">Details</TabsTrigger>
  </TabsList>
  <TabsContent value="one">Overview content</TabsContent>
  <TabsContent value="two">Details content</TabsContent>
</Tabs>

<!-- ✅ Always — AuronUI naming -->
<Tabs default-value="one">
  <TabList>
    <Tab value="one">Overview</Tab>
    <Tab value="two">Details</Tab>
  </TabList>
  <TabPanel value="one">Overview content</TabPanel>
  <TabPanel value="two">Details content</TabPanel>
</Tabs>
```

---

## Components

### Presentational

**Spinner** — loading indicator
```vue
<Spinner size="md" color="primary" />
<!-- size: xs | sm | md | lg | xl -->
<!-- color: default | primary | secondary | success | warning | danger | current -->
```

**Skeleton** — loading placeholder
```vue
<Skeleton class="h-8 w-32 rounded-lg" />
```

**Separator** — horizontal or vertical dividing line
```vue
<Separator orientation="horizontal" />
```

**Badge** — small status label
```vue
<Badge variant="solid" color="primary">New</Badge>
<!-- variant: solid | flat | outline -->
<!-- color: default | primary | secondary | success | warning | danger -->
```

**Chip** — closeable tag/filter pill
```vue
<Chip variant="flat" color="primary" @close="remove">Label</Chip>
```

**Text** — semantic text with size/weight variants
```vue
<Text size="sm" weight="medium">Hello</Text>
```

**Label** — accessible form label
```vue
<Label for="email">Email</Label>
```

**Kbd** — keyboard shortcut display
```vue
<Kbd>⌘K</Kbd>
```

**Avatar** — user avatar with image + fallback initials
```vue
<Avatar src="/user.jpg" name="Jane Doe" size="md" />
<AvatarGroup :max="3">
  <Avatar name="Alice" />
  <Avatar name="Bob" />
</AvatarGroup>
```

**Card** — content container with optional header/body/footer slots
```vue
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Actions</CardFooter>
</Card>
```

**EmptyState** — zero-data placeholder
```vue
<EmptyState>
  <EmptyStateContent>No results found</EmptyStateContent>
</EmptyState>
```

---

### Buttons & Actions

**Button** — primary interactive element
```vue
<Button variant="solid" color="primary" size="md" radius="md" @click="handle">
  Click me
</Button>
<!-- variant: solid | bordered | light | flat | faded | shadow | ghost -->
<!-- color: default | primary | secondary | success | warning | danger -->
<!-- size: xs | sm | md | lg | xl -->
<!-- radius: none | sm | md | lg | full -->
<!-- isIconOnly: boolean — square icon button -->
<!-- isLoading: boolean — shows spinner -->
<!-- fullWidth: boolean -->
<!-- disabled: boolean -->
```

**ButtonGroup** — group of related buttons
```vue
<ButtonGroup variant="bordered" size="sm">
  <Button>Left</Button>
  <Button>Middle</Button>
  <Button>Right</Button>
</ButtonGroup>
```

**ToggleButton** — pressable on/off button
```vue
<ToggleButton v-model="pressed">Bold</ToggleButton>
```

**ToggleButtonGroup** — single/multiple selection from button set
```vue
<ToggleButtonGroup v-model="selected" selection-mode="single">
  <ToggleButton value="left">Left</ToggleButton>
  <ToggleButton value="center">Center</ToggleButton>
  <ToggleButton value="right">Right</ToggleButton>
</ToggleButtonGroup>
```

**CloseButton** — accessible × dismiss button
```vue
<CloseButton @click="close" />
```

**Link** — accessible anchor element
```vue
<Link href="/docs">Read the docs</Link>
```

---

### Form Inputs

**Input** — text field with floating label, validation, and clear button
```vue
<Input
  v-model="value"
  label="Email"
  type="email"
  placeholder="you@example.com"
  :is-required="true"
  :is-invalid="!!error"
  :error-message="error"
/>
<!-- variant: flat | bordered | faded | underlined -->
<!-- size: sm | md | lg -->
<!-- labelPlacement: inside | outside | outside-left -->
<!-- isClearable: boolean -->
<!-- showPasswordToggle: boolean (for type="password") -->
```

**Textarea** — multiline text input
```vue
<Textarea v-model="bio" label="Bio" :min-rows="3" />
```

**NumberField** — numeric input with increment/decrement
```vue
<NumberField v-model="qty" label="Quantity" :min="0" :max="99" :step="1" />
```

**Checkbox** — single checkbox
```vue
<Checkbox v-model="agreed">I agree to the terms</Checkbox>
```

**CheckboxGroup** — grouped checkboxes
```vue
<CheckboxGroup v-model="selected" label="Options">
  <Checkbox value="a">Option A</Checkbox>
  <Checkbox value="b">Option B</Checkbox>
</CheckboxGroup>
```

**Radio / RadioGroup** — radio button group
```vue
<RadioGroup v-model="plan" label="Plan">
  <Radio value="free">Free</Radio>
  <Radio value="pro">Pro</Radio>
</RadioGroup>
```

**Switch** — toggle switch
```vue
<Switch v-model="enabled">Notifications</Switch>
```

**Select** — dropdown select
```vue
<Select v-model="country" label="Country" placeholder="Pick one">
  <SelectTrigger />
  <SelectContent>
    <SelectItem value="us">United States</SelectItem>
    <SelectItem value="gb">United Kingdom</SelectItem>
  </SelectContent>
</Select>
```

**InputOTP** — one-time password input
```vue
<InputOTP v-model="code" :length="6" />
```

**Fieldset** — groups related form fields
```vue
<Fieldset legend="Personal info">
  <Input v-model="name" label="Name" />
  <Input v-model="email" label="Email" />
</Fieldset>
```

**Form / FormField** — form wrapper with validation
```vue
<Form @submit="onSubmit">
  <FormField name="email" :rules="{ required: true }">
    <Input v-model="email" label="Email" />
  </FormField>
</Form>
```

---

### Overlays

**Modal** — dialog overlay
```vue
<Modal v-model:open="isOpen">
  <ModalTrigger as-child>
    <Button>Open</Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Title</ModalTitle>
      <ModalDescription>Description</ModalDescription>
    </ModalHeader>
    <ModalBody>Content here</ModalBody>
    <ModalFooter>
      <Button variant="ghost" @click="isOpen = false">Cancel</Button>
      <Button color="primary">Confirm</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

**AlertDialog** — destructive confirmation dialog
```vue
<AlertDialog v-model:open="isOpen">
  <AlertDialogTrigger as-child>
    <Button color="danger">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**Drawer** — slide-in panel
```vue
<Drawer v-model:open="isOpen" placement="right">
  <DrawerTrigger as-child><Button>Open</Button></DrawerTrigger>
  <DrawerContent>
    <DrawerHeader><DrawerTitle>Settings</DrawerTitle></DrawerHeader>
    <DrawerBody>Content</DrawerBody>
  </DrawerContent>
</Drawer>
<!-- placement: left | right | top | bottom -->
```

**Tooltip** — hover label
```vue
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger as-child>
      <Button>Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>Helpful text</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

**Popover** — click-triggered floating panel
```vue
<Popover>
  <PopoverTrigger as-child><Button>Open</Button></PopoverTrigger>
  <PopoverContent>Panel content</PopoverContent>
</Popover>
```

**HoverCard** — hover-triggered preview card (non-focus, pointer-based popover)
```vue
<HoverCard :open-delay="700" :close-delay="300">
  <HoverCardTrigger as-child>
    <Link href="/user/jane">@jane</Link>
  </HoverCardTrigger>
  <HoverCardContent>
    <p>Preview content shown on hover</p>
    <HoverCardArrow />
  </HoverCardContent>
</HoverCard>
```

---

### Feedback

**Alert** — inline status message
```vue
<Alert severity="success">
  <AlertIcon />
  <AlertTitle>Done!</AlertTitle>
  <AlertDescription>Your changes were saved.</AlertDescription>
</Alert>
<!-- severity: info | success | warning | danger -->
```

**Toast** — ephemeral notification (imperative API)
```vue
<script setup>
import { useToast } from '@auronui/vue'
const { toast } = useToast()
function notify() {
  toast({ title: 'Saved!', variant: 'success' })
}
</script>
<template>
  <ToastProvider>
    <ToastViewport />
  </ToastProvider>
</template>
```

**ProgressBar** — linear progress
```vue
<ProgressBar :value="60" :max="100" label="Upload" />
```

**ProgressCircle** — circular progress
```vue
<ProgressCircle :value="75" size="md" />
```

**Meter** — bounded measurement (e.g. disk usage)
```vue
<Meter :value="40" :min="0" :max="100" label="Storage" />
```

---

### Navigation

**Tabs** — tabbed content panels
```vue
<Tabs default-value="one" variant="primary">
  <TabList>
    <Tab value="one">Overview</Tab>
    <Tab value="two">Details</Tab>
    <TabIndicator />
  </TabList>
  <TabPanel value="one">Overview content</TabPanel>
  <TabPanel value="two">Details content</TabPanel>
</Tabs>
<!-- variant: primary | secondary -->
<!-- orientation: horizontal | vertical -->
```

**Accordion** — collapsible sections
```vue
<Accordion type="single" collapsible>
  <AccordionItem value="a">
    <AccordionHeader>
      <AccordionTrigger>Section A</AccordionTrigger>
    </AccordionHeader>
    <AccordionContent>Body A</AccordionContent>
  </AccordionItem>
</Accordion>
```

**Collapsible** — single show/hide section
```vue
<Collapsible v-model:open="open">
  <CollapsibleTrigger as-child><Button>Toggle</Button></CollapsibleTrigger>
  <CollapsibleContent>Hidden content</CollapsibleContent>
</Collapsible>
```

**Breadcrumbs** — hierarchical navigation
```vue
<Breadcrumbs>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
  <BreadcrumbItem>Current</BreadcrumbItem>
</Breadcrumbs>
```

**NavigationMenu** — site-header navigation with flyout content panels
```vue
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem value="products">
      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="/products/one">Product One</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem value="docs">
      <NavigationMenuLink href="/docs" :active="true">Docs</NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
  <NavigationMenuViewport />
</NavigationMenu>
<!-- orientation: horizontal | vertical -->
<!-- NavigationMenuLink: href, active (boolean), color, underline -->
<!-- NavigationMenuIndicator: optional, place inside NavigationMenuList after items -->
```

**Pagination** — page navigation
```vue
<Pagination v-model:page="page" :total="100" :per-page="10">
  <PaginationContent>
    <PaginationPrev />
    <PaginationItem v-for="p in pages" :key="p" :value="p">{{ p }}</PaginationItem>
    <PaginationNext />
  </PaginationContent>
</Pagination>
```

---

### Selection & Menus

**ListBox** — accessible list selection
```vue
<ListBox v-model="selected" selection-mode="single">
  <ListBoxItem value="a">Option A</ListBoxItem>
  <ListBoxItem value="b">Option B</ListBoxItem>
</ListBox>
```

**Dropdown** — context menu / action menu
```vue
<Dropdown>
  <DropdownTrigger as-child><Button>Actions</Button></DropdownTrigger>
  <DropdownMenu>
    <DropdownItem @click="edit">Edit</DropdownItem>
    <DropdownItem @click="remove" class="text-danger">Delete</DropdownItem>
  </DropdownMenu>
</Dropdown>
```

**ContextMenu** — right-click triggered menu
```vue
<ContextMenu>
  <ContextMenuTrigger as-child>
    <div>Right-click here</div>
  </ContextMenuTrigger>
  <ContextMenuContent aria-label="Actions">
    <ContextMenuItem>Cut</ContextMenuItem>
    <ContextMenuItem variant="danger">Delete</ContextMenuItem>
    <ContextMenuSub>
      <ContextMenuSubTrigger>Share via</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        <ContextMenuItem>Email</ContextMenuItem>
      </ContextMenuSubContent>
    </ContextMenuSub>
  </ContextMenuContent>
</ContextMenu>
<!-- ContextMenuItem variant: default | danger -->
<!-- also: ContextMenuCheckboxItem (v-model:is-selected), ContextMenuRadioGroup + ContextMenuRadioItem, ContextMenuSection (title, show-divider) -->
```

**Menubar** — desktop-style horizontal application menu bar
```vue
<Menubar>
  <MenubarMenu value="file">
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent aria-label="File menu">
      <MenubarItem>New File</MenubarItem>
      <MenubarItem>Save</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu value="edit">
    <MenubarTrigger>Edit</MenubarTrigger>
    <MenubarContent aria-label="Edit menu">
      <MenubarItem>Cut</MenubarItem>
      <MenubarItem>Copy</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
<!-- MenubarItem variant: default | danger -->
<!-- also: MenubarCheckboxItem (v-model:is-selected), MenubarRadioGroup + MenubarRadioItem, MenubarSection (title, show-divider), MenubarSub + MenubarSubTrigger + MenubarSubContent -->
```

**ComboBox** — searchable dropdown
```vue
<ComboBox v-model="value" :items="options" label="Framework">
  <ComboBoxInput placeholder="Search..." />
  <ComboBoxContent>
    <ComboBoxItem v-for="item in filtered" :key="item.value" :value="item.value">
      {{ item.label }}
    </ComboBoxItem>
    <ComboBoxEmpty>No results</ComboBoxEmpty>
  </ComboBoxContent>
</ComboBox>
```

---

### Data Display

**Table** — accessible data table
```vue
<Table>
  <TableHeader>
    <TableRow>
      <TableHeaderCell>Name</TableHeaderCell>
      <TableHeaderCell>Role</TableHeaderCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow v-for="row in rows" :key="row.id">
      <TableCell>{{ row.name }}</TableCell>
      <TableCell>{{ row.role }}</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

### Specialized

**Slider** — range input
```vue
<Slider v-model="volume" :min="0" :max="100" :step="1" />
```

**ScrollArea** — custom scrollbar container
```vue
<ScrollArea class="h-64">
  <div v-for="item in longList" :key="item">{{ item }}</div>
</ScrollArea>
```

**ScrollShadow** — fades content edges to indicate overflow
```vue
<ScrollShadow class="h-64 overflow-y-auto">
  Long content...
</ScrollShadow>
```

**Stepper** — multi-step wizard indicator
```vue
<Stepper :value="currentStep">
  <StepperItem :step="1">
    <StepperIndicator />
    <StepperTitle>Account</StepperTitle>
  </StepperItem>
  <StepperSeparator />
  <StepperItem :step="2">
    <StepperIndicator />
    <StepperTitle>Profile</StepperTitle>
  </StepperItem>
</Stepper>
```

**Calendar** — date picker calendar
```vue
<Calendar v-model="date" />
```

**DatePicker** — date picker with input
```vue
<DatePicker v-model="date" label="Pick a date" />
```

**TimeRangeField** — segmented start/end time input field
```vue
<TimeRangeField v-model="value" label="Meeting Window" variant="flat" size="md" color="default" />
<!-- variant: flat | bordered | faded | underlined | raised -->
<!-- size: sm | md | lg -->
<!-- labelPlacement: inside | outside | outside-left -->
<!-- granularity: hour | minute | second -->
<!-- hourCycle: 12 | 24 -->
<!-- value: { start: Time, end: Time } from @internationalized/date -->
```

**MonthPicker** — calendar-style grid for selecting a single month
```vue
<MonthPicker v-model="month" :min-value="minMonth" :max-value="maxMonth" />
<!-- value/defaultValue: DateValue from @internationalized/date -->
<!-- disabled / readonly: boolean -->
```

**MonthRangePicker** — calendar-style grid for selecting a month range
```vue
<MonthRangePicker v-model="range" :min-value="minMonth" :max-value="maxMonth" />
<!-- value: { start: DateValue, end: DateValue } -->
<!-- allowNonContiguousRanges / disabled / readonly: boolean -->
```

**YearRangePicker** — calendar-style grid for selecting a year range
```vue
<YearRangePicker v-model="range" :years-per-page="12" />
<!-- value: { start: DateValue, end: DateValue } -->
<!-- yearsPerPage: number (default 12) -->
<!-- allowNonContiguousRanges / disabled / readonly: boolean -->
```

**ColorPicker** — full color picker
```vue
<ColorPicker v-model="color" />
```

**Editable** — inline click/dblclick-to-edit text field
```vue
<Editable v-model="value" activation-mode="focus" submit-mode="blur">
  <EditableArea>
    <EditablePreview />
    <EditableInput />
  </EditableArea>
  <EditableEditTrigger />
  <EditableSubmitTrigger />
  <EditableCancelTrigger />
</Editable>
<!-- activationMode: focus | dblclick | none -->
<!-- submitMode: blur | enter | none | both -->
```

**AspectRatio** — enforces a width/height ratio
```vue
<AspectRatio :ratio="16/9">
  <img src="..." class="w-full h-full object-cover" />
</AspectRatio>
```

**Toolbar** — accessible horizontal toolbar
```vue
<Toolbar>
  <ToolbarButton>Bold</ToolbarButton>
  <ToolbarSeparator />
  <ToolbarButton>Italic</ToolbarButton>
</Toolbar>
```

**Tree** — hierarchical tree view
```vue
<Tree v-model:expanded="expanded" v-model:selected="selected">
  <TreeItem value="root" label="Root">
    <TreeItem value="child" label="Child" />
  </TreeItem>
</Tree>
```

**SplitterGroup** — resizable panel splitter
```vue
<SplitterGroup direction="horizontal">
  <SplitterPanel :default-size="30">Sidebar</SplitterPanel>
  <SplitterResizeHandle />
  <SplitterPanel>Main</SplitterPanel>
</SplitterGroup>
```

---

## Common Patterns

### Login Form

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Input, Form, FormField, Link, Separator, Text } from '@auronui/vue'

const email = ref('')
const password = ref('')

async function onSubmit() {
  // handle login
}
</script>

<template>
  <Form @submit="onSubmit" class="space-y-4 w-full max-w-sm">
    <FormField name="email">
      <Input v-model="email" type="email" label="Email" :is-required="true" />
    </FormField>
    <FormField name="password">
      <Input v-model="password" type="password" label="Password" :show-password-toggle="true" />
    </FormField>
    <Button type="submit" color="primary" :full-width="true">Sign in</Button>
    <Separator />
    <Text size="sm" class="text-center">
      No account? <Link href="/register">Sign up</Link>
    </Text>
  </Form>
</template>
```

### Confirm Delete Dialog

```vue
<script setup lang="ts">
import {
  Button, AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from '@auronui/vue'

const emit = defineEmits<{ deleted: [] }>()
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <Button color="danger" variant="bordered">Delete account</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete account?</AlertDialogTitle>
        <AlertDialogDescription>
          This will permanently delete your account and all your data.
          This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction @click="emit('deleted')">Delete account</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
```

### Data Table with Pagination

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Table, TableHeader, TableBody, TableRow, TableHeaderCell, TableCell,
  Pagination, PaginationContent, PaginationItem, PaginationPrev, PaginationNext,
  Spinner,
} from '@auronui/vue'

const props = defineProps<{
  rows: Array<{ id: string; name: string; email: string; role: string }>
  loading?: boolean
}>()

const page = ref(1)
const perPage = 10
const totalPages = computed(() => Math.ceil(props.rows.length / perPage))
const pageRows = computed(() =>
  props.rows.slice((page.value - 1) * perPage, page.value * perPage)
)
</script>

<template>
  <div class="space-y-4">
    <div v-if="loading" class="flex justify-center py-8">
      <Spinner size="lg" color="primary" />
    </div>
    <Table v-else>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Email</TableHeaderCell>
          <TableHeaderCell>Role</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="row in pageRows" :key="row.id">
          <TableCell>{{ row.name }}</TableCell>
          <TableCell>{{ row.email }}</TableCell>
          <TableCell>{{ row.role }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <Pagination v-model:page="page" :total="rows.length" :per-page="perPage">
      <PaginationContent>
        <PaginationPrev />
        <PaginationItem v-for="p in totalPages" :key="p" :value="p">{{ p }}</PaginationItem>
        <PaginationNext />
      </PaginationContent>
    </Pagination>
  </div>
</template>
```

---

## Composables

Every stateful component ships a matching `use*` composable for headless control from outside the component tree. All composables are imported from `@auronui/vue`.

### useDisclosure — open/close state (14 components)

Controls Modal, Drawer, Popover, Tooltip, AlertDialog, Collapsible, Dropdown, Select, ComboBox, DatePicker, DateRangePicker, DateTimePicker, Autocomplete, ColorPicker.

```ts
import { useDisclosure } from '@auronui/vue'

const modal = useDisclosure()          // closed by default
const drawer = useDisclosure(true)     // open by default

modal.open()
modal.close()
modal.toggle()
modal.isOpen   // Readonly<Ref<boolean>>
```

```html
<Modal :open="modal.isOpen.value" @update:open="modal.onOpenChange">...</Modal>
```

### usePagination

```ts
import { usePagination } from '@auronui/vue'

const { page, totalPages, nextPage, prevPage, goToPage, isFirst, isLast } = usePagination({
  totalItems: 200,
  pageSize: 10,
  defaultPage: 1,
})
```

```html
<Pagination :page="page.value" :total="totalPages.value" @change="goToPage" />
```

### useStepper

```ts
import { useStepper } from '@auronui/vue'

const { step, nextStep, prevStep, goToStep, isFirst, isLast, getStepStatus, reset } = useStepper({
  steps: ['Account', 'Profile', 'Review'],
  defaultStep: 1,
})
```

### useTabs

```ts
import { useTabs } from '@auronui/vue'

const { activeTab, setTab, onTabChange } = useTabs({ defaultTab: 'overview' })
```

```html
<Tabs :default-value="activeTab.value" @update:model-value="onTabChange">...</Tabs>
```

### useAccordion

```ts
import { useAccordion } from '@auronui/vue'

// Single mode
const { expanded, toggle, collapseAll } = useAccordion({ type: 'single', collapsible: true })

// Multiple mode
const { expanded, toggle, expandAll, collapseAll } = useAccordion({
  type: 'multiple',
  defaultExpanded: ['item-1'],
})
```

### useSlider

```ts
import { useSlider } from '@auronui/vue'

// Single thumb
const { value, setValue } = useSlider({ defaultValue: 50, min: 0, max: 100 })

// Range (two thumbs)
const { value, setValue } = useSlider({ defaultValue: [20, 80], min: 0, max: 100 })
```

### useListBox

```ts
import { useListBox } from '@auronui/vue'

const { selected, select, deselect, toggle, selectAll, deselectAll } = useListBox({
  multiple: true,
  defaultSelected: new Set(['a']),
})
```

### useCheckboxGroup

```ts
import { useCheckboxGroup } from '@auronui/vue'

const { values, toggle, isChecked, isIndeterminate, isAllChecked, checkAll, uncheckAll } =
  useCheckboxGroup({
    options: ['red', 'green', 'blue'],
    defaultValues: ['red'],
  })
```

### useRadioGroup

```ts
import { useRadioGroup } from '@auronui/vue'

const { value, setValue, clear } = useRadioGroup({ defaultValue: 'option-a' })
```

### useCalendar

```ts
import { useCalendar } from '@auronui/vue'
import { today, getLocalTimeZone } from '@internationalized/date'

const { value, setValue, displayMonth, nextMonth, prevMonth, isDisabled } = useCalendar({
  defaultValue: today(getLocalTimeZone()),
})
```

### useRangeCalendar

```ts
import { useRangeCalendar } from '@auronui/vue'

const { start, end, setRange, isComplete, clearRange } = useRangeCalendar()
// start / end are ComputedRef<DateValue | undefined>
// isComplete is true when both start and end are set
```

### useTree

```ts
import { useTree } from '@auronui/vue'

const { selected, expanded, select, deselect, expand, collapse, expandAll, collapseAll } =
  useTree({ defaultSelected: new Set(['node-1']), multiple: false })
```

### useSplitter

```ts
import { useSplitter } from '@auronui/vue'

const { sizes, setSizes, resetSizes, onLayout } = useSplitter({ defaultSizes: [30, 70] })
```

```html
<SplitterGroup @layout="onLayout">
  <SplitterPanel :default-size="sizes[0]" />
  <SplitterResizeHandle />
  <SplitterPanel :default-size="sizes[1]" />
</SplitterGroup>
```

### useColorPicker

```ts
import { useColorPicker } from '@auronui/vue'

const { color, setColor, hue, saturation, brightness, alpha, toHex, toRgb, toHsl } =
  useColorPicker({ defaultValue: '#3b82f6' })

console.log(toHex())          // '#3b82f6'
console.log(hue.value)        // 217
```

```html
<ColorPicker v-model="color" @update:model-value="onColorChange" />
```

### useOTP

```ts
import { useOTP } from '@auronui/vue'

const { value, isComplete, reset, onValueChange, onOTPComplete } = useOTP({
  length: 6,
  onComplete: (code) => verifyCode(code),
})
```

```html
<InputOTP :model-value="value.value" @update:model-value="onValueChange" @complete="onOTPComplete" />
```

### useSwatchPicker

```ts
import { useSwatchPicker } from '@auronui/vue'

const { selectedColor, hasSelection, setColor, clearSelection, isSelected, onColorChange } =
  useSwatchPicker({ defaultValue: '#ff0000' })
```

```html
<ColorSwatchPicker :model-value="selectedColor.value" @update:model-value="onColorChange" />
```

---

## Imports

```ts
import {
  Button, ButtonGroup, CloseButton, ToggleButton, ToggleButtonGroup,
  Input, Textarea, NumberField, Checkbox, CheckboxGroup,
  Radio, RadioGroup, Switch, SwitchGroup,
  Select, SelectTrigger, SelectContent, SelectItem,
  Modal, ModalTrigger, ModalContent, ModalHeader, ModalBody, ModalFooter,
  ModalTitle, ModalDescription, ModalClose,
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogBody, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription,
  AlertDialogAction, AlertDialogCancel,
  Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerBody,
  Tooltip, TooltipProvider, TooltipTrigger, TooltipContent,
  Popover, PopoverTrigger, PopoverContent,
  HoverCard, HoverCardTrigger, HoverCardContent, HoverCardArrow,
  Tabs, TabList, Tab, TabPanel, TabIndicator,
  Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent,
  NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger,
  NavigationMenuContent, NavigationMenuLink, NavigationMenuViewport,
  NavigationMenuIndicator, NavigationMenuSub,
  Alert, AlertIcon, AlertTitle, AlertDescription,
  ToastProvider, Toast, ToastViewport, useToast,
  useDisclosure, usePagination, useStepper, useTabs, useAccordion,
  useSlider, useListBox, useCheckboxGroup, useRadioGroup,
  useCalendar, useRangeCalendar, useTree, useSplitter,
  useColorPicker, useColorState, useOTP, useSwatchPicker,
  Badge, Chip, Avatar, AvatarGroup, Card, CardHeader, CardBody, CardFooter,
  Spinner, Skeleton, Separator, Text, Label, Kbd,
  Pagination, PaginationContent, PaginationItem, PaginationPrev, PaginationNext,
  Table, TableHeader, TableBody, TableRow, TableCell, TableHeaderCell,
  ListBox, ListBoxItem, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem,
  ContextMenuCheckboxItem, ContextMenuRadioGroup, ContextMenuRadioItem,
  ContextMenuSection, ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent,
  Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem,
  MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarSection,
  MenubarSub, MenubarSubTrigger, MenubarSubContent,
  ComboBox, ComboBoxInput, ComboBoxContent, ComboBoxItem, ComboBoxEmpty,
  Autocomplete, AutocompleteInput, AutocompleteContent,
  Slider, ScrollArea, ScrollShadow, ProgressBar, ProgressCircle, Meter,
  Calendar, DatePicker, ColorPicker,
  TimeRangeField, MonthPicker, MonthRangePicker, YearRangePicker,
  Editable, EditableArea, EditablePreview, EditableInput,
  EditableEditTrigger, EditableSubmitTrigger, EditableCancelTrigger,
  Breadcrumbs, BreadcrumbItem, Toolbar, ToolbarButton, ToolbarSeparator,
  Collapsible, CollapsibleTrigger, CollapsibleContent,
  Stepper, StepperItem, StepperIndicator, StepperTitle, StepperSeparator,
  Tree, TreeItem, AspectRatio, SplitterGroup, SplitterPanel, SplitterResizeHandle,
} from '@auronui/vue'
```
