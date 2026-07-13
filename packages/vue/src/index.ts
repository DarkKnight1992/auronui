// @auronui/vue — Vue 3 designed components
// Components, composables, and utilities are exported here as they are implemented.
// Phase 1+: component exports added here.

// Composables (Plan 04 — group 1)
export { useIsMounted } from "./composables/useIsMounted";
export { useIsHydrated } from "./composables/useIsHydrated";
export { useMediaQuery } from "./composables/useMediaQuery";
export { useOverlayState } from "./composables/useOverlayState";
export type { UseOverlayStateProps, UseOverlayStateReturn } from "./composables/useOverlayState";

// Composables (Plan 05 — group 2)
export { useCSSVariable } from "./composables/useCSSVariable";
export { useMeasuredHeight } from "./composables/useMeasuredHeight";
export { useListData } from "./composables/useListData";
export type { ListOptions, ListData, Key } from "./composables/useListData";

// Composables — public use* API
export { useDisclosure } from "./composables/useDisclosure";
export type { UseDisclosureReturn } from "./composables/useDisclosure";

export { usePagination } from "./composables/usePagination";
export type { UsePaginationOptions, UsePaginationReturn } from "./composables/usePagination";

export { useStepper } from "./composables/useStepper";
export type { UseStepperOptions, UseStepperReturn, StepStatus } from "./composables/useStepper";

export { useTabs } from "./composables/useTabs";
export type { UseTabsOptions, UseTabsReturn } from "./composables/useTabs";

export { useAccordion } from "./composables/useAccordion";
export type { UseAccordionOptions, UseAccordionReturn, AccordionType, AccordionValue } from "./composables/useAccordion";

export { useSlider } from "./composables/useSlider";
export type { UseSliderOptions, UseSliderReturn, SliderValue } from "./composables/useSlider";

export { useListBox } from "./composables/useListBox";
export type { UseListBoxOptions, UseListBoxReturn, ListBoxValue } from "./composables/useListBox";

export { useCheckboxGroup } from "./composables/useCheckboxGroup";
export type { UseCheckboxGroupOptions, UseCheckboxGroupReturn } from "./composables/useCheckboxGroup";

export { useRadioGroup } from "./composables/useRadioGroup";
export type { UseRadioGroupOptions, UseRadioGroupReturn } from "./composables/useRadioGroup";

export { useCalendar } from "./composables/useCalendar";
export type { UseCalendarOptions, UseCalendarReturn } from "./composables/useCalendar";

export { useRangeCalendar } from "./composables/useRangeCalendar";
export type { UseRangeCalendarOptions, UseRangeCalendarReturn, DateRange } from "./composables/useRangeCalendar";

export { useTree } from "./composables/useTree";
export type { UseTreeOptions, UseTreeReturn, TreeValue } from "./composables/useTree";

export { useSplitter } from "./composables/useSplitter";
export type { UseSplitterOptions, UseSplitterReturn } from "./composables/useSplitter";

// Utilities
export { composeClassName, cx } from "./utils/composeClassName";
export { composeSlotClassName } from "./utils/composeSlotClassName";
export { mapPropsVariants } from "./utils/mapPropsVariants";
export { dataAttr } from "./utils/dataAttr";
export { createContext } from "./utils/context";

// Phase 1 — Foundation: Presentational Components
export { Spinner } from './components/spinner'
export type { SpinnerVariants } from './components/spinner'

export { Separator } from './components/separator'
export type { SeparatorVariants } from './components/separator'

export { Skeleton } from './components/skeleton'
export type { SkeletonVariants } from './components/skeleton'

export { Text } from './components/text'
export type { TextVariants } from './components/text'

export { Label } from './components/label'
export type { LabelVariants } from './components/label'

export { Description } from './components/description'

export { Header } from './components/header'

export { Kbd } from './components/kbd'
export type { KbdVariants } from './components/kbd'

export { Badge } from './components/badge'
export type { BadgeVariants } from './components/badge'

export { Chip, Chip as Tag } from './components/chip'
export type { ChipVariants, ChipVariants as TagVariants } from './components/chip'

export { Surface, useSurfaceInject, surfaceContextKey } from './components/surface'
export type { SurfaceContext, SurfaceVariants } from './components/surface'

export { Card, CardHeader, CardBody, CardFooter } from './components/card'
export type { CardVariants } from './components/card'

export { EmptyState, EmptyStateContent } from './components/empty-state'

// Phase 2 — Foundation: Reka UI Backed Components
export { Button, ButtonGroup, CloseButton, ToggleButton, ToggleButtonGroup } from './components/button'
export type { ButtonVariants, ButtonGroupContext, ToggleButtonGroupContext } from './components/button'

export { Link } from './components/link'

// Form wrapper
export { Form, FormField, useForm, useField } from './components/form'
export type { ValidationMode, FieldRules, CustomValidator, ValidationContext, FieldRegistration, FormContext, FormOptions, FieldHandle, FieldOptions } from './components/form'

// Phase 3 — Form: Simple Inputs
export { Input } from './components/input'
export type { InputVariants } from './components/input'

export { InputGroup, InputGroupAddon, InputGroupInput, useInputGroupProvide, useInputGroupInject, inputGroupContextKey } from './components/input-group'
export type { InputGroupContext, InputGroupVariants } from './components/input-group'

export { SearchField } from './components/search-field'

export { Textarea } from './components/textarea'
export type { TextAreaVariants } from './components/textarea'

export { NumberField } from './components/number-field'
export type { NumberFieldVariants } from './components/number-field'

export { Fieldset } from './components/fieldset'

// Phase 3 — Form: Editable (Reka gap-fill)
export {
  Editable,
  EditableArea,
  EditablePreview,
  EditableInput,
  EditableEditTrigger,
  EditableSubmitTrigger,
  EditableCancelTrigger,
} from './components/editable'

// Phase 4 — Form: Selection (Dual-Context)
export { Checkbox, CheckboxGroup, useCheckboxGroupProvide, useCheckboxGroupInject, checkboxGroupContextKey } from './components/checkbox'
export type { CheckboxGroupContext } from './components/checkbox'

export { Radio, RadioGroup, useRadioGroupProvide, useRadioGroupInject, radioGroupContextKey } from './components/radio'
export type { RadioGroupContext } from './components/radio'

export { Switch, SwitchGroup, useSwitchGroupProvide, useSwitchGroupInject, switchGroupContextKey } from './components/switch'
export type { SwitchGroupContext } from './components/switch'

export { InputOTP } from './components/input-otp'

// Phase 5 — Overlay: Popover
export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverAnchor,
  PopoverClose,
} from './components/popover'

// Phase 5 — Overlay: Tooltip
export {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from './components/tooltip'

// Phase 5 — Overlay: Modal
export {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalClose,
} from './components/modal'

// Phase 5 — Overlay: AlertDialog
export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogIcon,
  AlertDialogAction,
  AlertDialogCancel,
} from './components/alert-dialog'

// Phase 5 — Overlay: Drawer
export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerOverlay,
  DrawerMain,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
  DrawerTitle,
} from './components/drawer'
export type { DrawerPlacement, DrawerSize } from './components/drawer'

// Phase 7 — Overlay: HoverCard (Reka gap-fill)
export {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
} from './components/hover-card'

// Phase 6 — Navigation & Feedback: Tabs
export { Tabs, TabList, Tab, TabPanel, TabIndicator } from './components/tabs'

// Phase 6 — Navigation & Feedback: Accordion
export {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from './components/accordion'

// Phase 6 — Navigation & Feedback: Collapsible
export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleGroup,
} from './components/collapsible'

// Phase 6 — Navigation & Feedback: Breadcrumbs
export { Breadcrumbs, BreadcrumbItem } from './components/breadcrumbs'

// Phase 6 — Navigation & Feedback: Toolbar
export {
  Toolbar,
  ToolbarButton,
  ToolbarLink,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from './components/toolbar'

// Phase 6 — Navigation & Feedback: Alert
export { Alert, AlertIcon, AlertTitle, AlertDescription } from './components/alert'
export type { AlertSeverity } from './components/alert/Alert.vue'

// Phase 6 — Navigation & Feedback: Toast
export {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  ToastViewport,
  useToast,
} from './components/toast'
export type { ToastOptions, ToastInstance, ToastPosition, ToastVariant } from './composables/useToast'

// Phase 7 — Selection: List / Menu / Combo
export { ListBox, ListBoxItem, ListBoxSection } from './components/list-box'
export type { ListBoxContext, ListBoxVariants, ListBoxItemVariants, ListBoxSectionVariants } from './components/list-box'

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './components/select'
export type { SelectContext, SelectVariants } from './components/select'

// Phase 7 — Selection: Dropdown
export {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownCheckboxItem,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownSection,
  DropdownSub,
  DropdownSubTrigger,
  DropdownSubContent,
  dropdownContextKey,
  useDropdownProvide,
  useDropdownInject,
} from './components/dropdown'
export type { DropdownContext } from './components/dropdown'

// Phase 7 — Selection: ContextMenu (Reka gap-fill)
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSection,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from './components/context-menu'

// Phase 7 — Navigation: Menubar (Reka gap-fill)
export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSection,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from './components/menubar'

// Phase 7 — Navigation: NavigationMenu (Reka gap-fill)
export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
  NavigationMenuIndicator,
  NavigationMenuSub,
} from './components/navigation-menu'

// Phase 7 — Selection: ComboBox (SEL-05)
export {
  ComboBox,
  ComboBoxInput,
  ComboBoxContent,
  ComboBoxItem,
  ComboBoxEmpty,
  comboBoxContextKey,
  useComboBoxProvide,
  useComboBoxInject,
} from './components/combo-box'
export type { ComboBoxContext, ComboBoxVariants, ComboBoxItemData } from './components/combo-box'

// Phase 7 — Selection: Autocomplete (SEL-06)
export {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteItem,
  AutocompleteCreateItem,
  autocompleteContextKey,
  useAutocompleteProvide,
  useAutocompleteInject,
} from './components/autocomplete'
export type { AutocompleteContext, AutocompleteVariants, AutocompleteItemData } from './components/autocomplete'


// Phase 8 — Pagination
export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrev,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationEllipsis,
  usePaginationProvide,
  usePaginationInject,
  createPaginationContext,
  paginationContextKey,
} from './components/pagination'
export type { PaginationContext, PaginationVariants } from './components/pagination'

// Phase 8 — Data Table
export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
  TableFooter,
  tableContextKey,
  useTableProvide,
  useTableInject,
  useTableKeyboardNav,
} from './components/table'
export type { TableContext, TableKeyboardNav, TableKeyboardNavOptions } from './components/table'

// Phase 9 — Specialized: Media & Feedback
export { Avatar, AvatarGroup } from './components/avatar'
export type { AvatarGroupContext } from './components/avatar'

// Reka UI primitives + custom
export { AspectRatio } from './components/aspect-ratio'
export type { AspectRatioVariants } from './components/aspect-ratio'

export { SplitterGroup, SplitterPanel, SplitterResizeHandle, splitterContextKey } from './components/splitter'
export type { SplitterGroupContext, SplitterVariants } from './components/splitter'

export {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperContent,
  StepperSeparator,
  stepperContextKey,
} from './components/stepper'
export type { StepperContext, StepperVariants } from './components/stepper'

export { Tree, TreeItem, TreeItemToggle, treeContextKey } from './components/tree'
export type { TreeContext, TreeVariants } from './components/tree'

export { Slider } from './components/slider'

export { Icon } from './components/icon'

export { ProgressBar } from './components/progress-bar'
export { ProgressCircle } from './components/progress-circle'

export { Meter } from './components/meter'

export { ScrollShadow } from './components/scroll-shadow'
export { ScrollArea } from './components/scroll-area'

// Phase 10 — Specialized: Date & Time (plan 01)
export { Calendar } from './components/calendar'
export { RangeCalendar } from './components/range-calendar'

export { CalendarYearPicker } from './components/calendar-year-picker'
export { MonthPicker } from './components/month-picker'
export { MonthRangePicker } from './components/month-range-picker'
export { YearRangePicker } from './components/year-range-picker'

// Phase 10 — Specialized: Date & Time (plan 02)
export { DateInput } from './components/date-input'
export { DateRangeField } from './components/date-range-field'
export { TimeField } from './components/time-field'
export { TimeRangeField } from './components/time-range-field'

// Phase 10 — Specialized: Date & Time (plan 03)
export { DatePicker } from './components/date-picker'
export { DateRangePicker } from './components/date-range-picker'
export { DateTimePicker } from './components/date-time-picker'
export { TimePicker } from './components/time-picker'
export type { DateRange as DateRangePickerRange } from './components/date-range-picker'

// Phase 11 — Specialized: Color
export { ColorArea } from './components/color-area'
export { ColorSlider } from './components/color-slider'
export { ColorField } from './components/color-field'
export { ColorSwatch } from './components/color-swatch'
export { ColorSwatchPicker } from './components/color-swatch-picker'
export { ColorInputGroup } from './components/color-input-group'
export { ColorPicker } from './components/color-picker'
export { useColorState } from './composables/useColorState'
export type { UseColorStateProps, UseColorStateReturn, ColorFormat } from './composables/useColorState'

export { useColorPicker } from './composables/useColorPicker'
export type { UseColorPickerOptions, UseColorPickerReturn } from './composables/useColorPicker'

export { useOTP } from './composables/useOTP'
export type { UseOTPOptions, UseOTPReturn } from './composables/useOTP'

export { useSwatchPicker } from './composables/useSwatchPicker'
export type { UseSwatchPickerOptions, UseSwatchPickerReturn } from './composables/useSwatchPicker'

export {
  Sidebar,
  SidebarSearch,
  SidebarSection,
  SidebarItem,
  useSidebarInject,
  useSidebarProvide,
  sidebarContextKey,
} from './components/sidebar'
export type { SidebarContext, SidebarItemData, SidebarSectionData } from './components/sidebar'

export { useLocationPath } from './composables/useLocationPath'

export { Statistic } from './components/statistic'
export type { StatisticVariants } from './components/statistic'

export { Timeline, TimelineItem, useTimelineProvide, useTimelineInject, timelineContextKey } from './components/timeline'
export type { TimelineContext, TimelineVariants } from './components/timeline'

export { Image } from './components/image'
export type { ImageVariants } from './components/image'

export { Transfer } from './components/transfer'
export type { TransferItem, TransferVariants } from './components/transfer'

export { FileUpload } from './components/file-upload'
export type { FileRejection, FileUploadVariants } from './components/file-upload'

export { Cascader } from './components/cascader'
export type { CascaderVariants } from './components/cascader'

export { CommandPalette } from './components/command-palette'
export type { CommandPaletteItemData, CommandPaletteVariants } from './components/command-palette'
