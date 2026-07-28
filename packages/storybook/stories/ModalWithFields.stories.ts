import type { Meta, StoryObj } from '@storybook/vue3-vite'
import {
  Button,
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Autocomplete,
} from '@auronui/vue'

const meta: Meta = {
  title: 'Components/Modal With Fields',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj

const components = {
  Button,
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Autocomplete,
}

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
]

const colors = [
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
]

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'de', label: 'Germany' },
]

const cities = [
  { value: 'nyc', label: 'New York' },
  { value: 'la', label: 'Los Angeles' },
  { value: 'sf', label: 'San Francisco' },
  { value: 'chi', label: 'Chicago' },
]

export const TwoSelectsTwoAutocompletes: Story = {
  name: 'Two Selects + Two Autocompletes',
  render: () => ({
    components,
    setup: () => ({ fruits, colors, countries, cities }),
    template: `
      <Modal>
        <ModalTrigger as-child>
          <Button color="primary">Open modal</Button>
        </ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Modal with mixed fields</ModalTitle>
            <ModalDescription>
              Two Select fields and two Autocomplete fields, stacked in the same dialog —
              used to verify dropdown popovers render and receive clicks correctly above
              the modal panel.
            </ModalDescription>
          </ModalHeader>
          <ModalBody class="space-y-4">
            <Select label="Favorite fruit" variant="bordered" placeholder="Pick a fruit">
              <SelectTrigger><SelectValue placeholder="Pick a fruit" /></SelectTrigger>
              <SelectContent>
                <SelectItem v-for="item in fruits" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
              </SelectContent>
            </Select>

            <Select label="Favorite color" variant="bordered" placeholder="Pick a color">
              <SelectTrigger><SelectValue placeholder="Pick a color" /></SelectTrigger>
              <SelectContent>
                <SelectItem v-for="item in colors" :key="item.value" :value="item.value">{{ item.label }}</SelectItem>
              </SelectContent>
            </Select>

            <Autocomplete
              label="Country"
              variant="bordered"
              placeholder="Search countries..."
              :items="countries"
            />

            <Autocomplete
              label="City"
              variant="bordered"
              placeholder="Search cities..."
              :items="cities"
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost">Cancel</Button>
            <Button color="primary">Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    `,
  }),
}
