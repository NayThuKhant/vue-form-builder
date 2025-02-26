<template>
  <div class="p-5">
    <h1 class="mb-6 text-2xl font-bold">Vue Dynamic Form Builder</h1>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- BUILDER SECTION -->
      <div class="rounded-lg border bg-gray-50 p-4">
        <h2 class="mb-4 text-xl font-semibold">Form Builder</h2>

        <!-- Component Selector -->
        <div class="mb-4 flex gap-2">
          <Select v-model="selectedComponent" :options="availableComponents" optionLabel="name" placeholder="Select component type" class="w-full" />
          <Button @click="addComponent" icon="pi pi-plus" :disabled="!selectedComponent" />
        </div>

        <!-- Component Properties Editor -->
        <div v-if="selectedComponent" class="mb-4 rounded border bg-white p-3">
          <h3 class="mb-2 font-medium">Component Properties</h3>

          <div class="mb-2">
            <label class="mb-1 block text-sm">Label</label>
            <InputText v-model="componentProps.label" class="w-full" />
          </div>

          <div class="mb-2">
            <label class="mb-1 block text-sm">Field Name</label>
            <InputText v-model="componentProps.name" class="w-full" />
          </div>

          <div class="mb-2">
            <label class="mb-1 block text-sm">Placeholder</label>
            <InputText v-model="componentProps.placeholder" class="w-full" />
          </div>

          <div class="mb-2 flex items-center">
            <Checkbox v-model="componentProps.required" :binary="true" inputId="required" />
            <label for="required" class="ml-2">Required field</label>
          </div>

          <!-- Select Options -->
          <div v-if="selectedComponent.name === 'Select'" class="mt-3 border-t pt-3">
            <div class="mb-2 flex items-center justify-between">
              <h4 class="font-medium">Options</h4>
              <Button icon="pi pi-plus" text size="small" @click="addOption" />
            </div>

            <div v-for="(option, idx) in componentProps.options" :key="idx" class="mb-2 flex gap-2">
              <InputText v-model="option.label" placeholder="Label" class="w-full" />
              <InputText v-model="option.value" placeholder="Value" class="w-full" />
              <Button icon="pi pi-trash" severity="danger" text @click="removeOption(idx)" />
            </div>
          </div>
        </div>

        <!-- Form Field List -->
        <div class="rounded border bg-white p-3">
          <h3 class="mb-3 font-medium">Form Structure</h3>

          <div v-if="formFields.length === 0" class="py-4 text-center text-gray-500">No fields added yet. Use the component selector above to add fields.</div>

          <div v-else class="space-y-2">
            <div v-for="(field, index) in formFields" :key="index" class="flex items-center justify-between rounded border bg-gray-50 p-2">
              <div>
                <span class="font-medium">{{ field.label || 'Unnamed Field' }}</span>
                <span class="ml-2 text-xs text-gray-500">({{ field.type }})</span>
              </div>
              <div class="flex gap-1">
                <Button icon="pi pi-pencil" text size="small" @click="editField(index)" />
                <Button icon="pi pi-trash" text size="small" severity="danger" @click="removeField(index)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- PREVIEW SECTION -->
      <div class="rounded-lg border bg-white p-4">
        <h2 class="mb-4 text-xl font-semibold">Form Preview</h2>

        <div v-if="formFields.length === 0" class="py-12 text-center text-gray-500">Your form preview will appear here</div>

        <form v-else @submit.prevent="submitForm" class="space-y-4">
          <div v-for="(field, index) in formFields" :key="index" class="mb-4">
            <label :for="`field-${index}`" class="mb-1 block font-medium">
              {{ field.label }}
              <span v-if="field.required" class="text-red-500">*</span>
            </label>

            <!-- Input field -->
            <InputText v-if="field.type === 'input'" :id="`field-${index}`" v-model="formData[field.name]" :placeholder="field.placeholder" :required="field.required" class="w-full" />

            <!-- Select field -->
            <Select
              v-else-if="field.type === 'select'"
              :id="`field-${index}`"
              v-model="formData[field.name]"
              :options="field.options"
              :placeholder="field.placeholder"
              optionLabel="label"
              optionValue="value"
              :required="field.required"
              class="w-full"
            />
          </div>

          <Button type="submit" label="Submit Form" class="mt-4" />
        </form>
      </div>
    </div>

    <!-- REAL-TIME CUSTOMER DATA DISPLAY -->
    <div v-if="formFields.length > 0" class="mt-6 rounded-lg border bg-white p-4">
      <h2 class="mb-4 text-xl font-semibold">Customer Information Preview</h2>

      <div v-if="hasFormData" class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <!-- Customer data display section -->
        <div class="space-y-4">
          <div v-for="(field, index) in formFields" :key="index" class="mb-2">
            <div class="mb-1 text-sm text-gray-500">{{ field.label }}</div>

            <!-- Display the value based on field type -->
            <div v-if="field.type === 'input'" class="rounded border bg-gray-50 p-2">
              {{ formData[field.name] || '-' }}
            </div>

            <div v-else-if="field.type === 'select'" class="rounded border bg-gray-50 p-2">
              {{ getSelectLabel(field, formData[field.name]) || '-' }}
            </div>
          </div>
        </div>

        <!-- JSON data display (for developers) -->
        <div>
          <h3 class="mb-2 font-medium">Form Data (JSON)</h3>
          <pre class="h-full overflow-auto rounded border bg-gray-50 p-3 text-sm">{{ JSON.stringify(formData, null, 2) }}</pre>
        </div>
      </div>

      <div v-else class="py-6 text-center text-gray-500">As the customer fills out the form, their information will appear here in real-time.</div>
    </div>

    <!-- Form Schema Export -->
    <div v-if="formFields.length > 0" class="mt-6 rounded-lg border p-4">
      <div class="mb-2 flex items-center justify-between">
        <h3 class="font-medium">Form Schema</h3>
        <Button label="Copy Schema" icon="pi pi-copy" size="small" text @click="copySchema" />
      </div>
      <pre class="overflow-auto rounded bg-gray-100 p-3 text-sm">{{ JSON.stringify(formSchema, null, 2) }}</pre>
    </div>

    <!-- Submitted Data View -->
    <div v-if="formSubmitted" class="mt-6 rounded-lg border bg-green-50 p-4">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xl font-semibold">Submitted Customer Information</h2>
        <Button icon="pi pi-times" text @click="formSubmitted = false" />
      </div>

      <div class="rounded border bg-white p-4">
        <div v-for="(field, index) in formFields" :key="index" class="flex border-b py-2 last:border-b-0">
          <div class="w-1/3 font-medium">{{ field.label }}</div>
          <div class="w-2/3">
            {{ field.type === 'select' ? getSelectLabel(field, formData[field.name]) : formData[field.name] }}
          </div>
        </div>
      </div>

      <div class="mt-4 flex justify-end">
        <Button label="Process Data" severity="success" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Checkbox from 'primevue/checkbox'

// Available component types
const availableComponents = ref([
  { name: 'Input', component: 'InputText' },
  { name: 'Select', component: 'Select' }
])

// Form building state
const selectedComponent = ref(null)
const componentProps = reactive({
  label: '',
  name: '',
  placeholder: '',
  required: false,
  options: []
})
const formFields = ref([])
const editingIndex = ref(-1)

// Form preview state
const formData = reactive({})
const formSubmitted = ref(false)

// Computed property to check if any form data exists
const hasFormData = computed(() => {
  return Object.values(formData).some((value) => value !== undefined && value !== null && value !== '')
})

// Helper function to get the label for a select value
const getSelectLabel = (field, value) => {
  if (!value || !field.options) return ''
  const option = field.options.find((opt) => opt.value === value)
  return option ? option.label : value
}

// Reset component properties
const resetComponentProps = () => {
  componentProps.label = ''
  componentProps.name = ''
  componentProps.placeholder = ''
  componentProps.required = false
  componentProps.options = []
  editingIndex.value = -1
}

// Add new option for Select component
const addOption = () => {
  componentProps.options.push({ label: '', value: '' })
}

// Remove option from Select component
const removeOption = (index) => {
  componentProps.options.splice(index, 1)
}

// Add component to form
const addComponent = () => {
  if (!selectedComponent.value) return

  // Create field configuration
  const fieldConfig = {
    type: selectedComponent.value.name.toLowerCase(),
    component: selectedComponent.value.component,
    label: componentProps.label || 'Untitled Field',
    name: componentProps.name || `field_${Date.now()}`,
    placeholder: componentProps.placeholder || '',
    required: componentProps.required
  }

  // Add options for Select component
  if (selectedComponent.value.name === 'Select') {
    fieldConfig.options = JSON.parse(JSON.stringify(componentProps.options))
  }

  // Update existing field or add new one
  if (editingIndex.value >= 0) {
    formFields.value[editingIndex.value] = fieldConfig
  } else {
    formFields.value.push(fieldConfig)
  }

  // Reset form
  selectedComponent.value = null
  resetComponentProps()
}

// Edit existing field
const editField = (index) => {
  const field = formFields.value[index]

  selectedComponent.value = availableComponents.value.find((c) => c.name.toLowerCase() === field.type)

  componentProps.label = field.label
  componentProps.name = field.name
  componentProps.placeholder = field.placeholder
  componentProps.required = field.required

  if (field.options) {
    componentProps.options = JSON.parse(JSON.stringify(field.options))
  } else {
    componentProps.options = []
  }

  editingIndex.value = index
}

// Remove field from form
const removeField = (index) => {
  const fieldName = formFields.value[index]?.name

  formFields.value.splice(index, 1)

  // Clean up form data if exists
  if (formData[fieldName]) {
    delete formData[fieldName]
  }
}

// Export form schema (without component references)
const formSchema = computed(() => {
  return formFields.value.map((field) => ({
    type: field.type,
    label: field.label,
    name: field.name,
    placeholder: field.placeholder || '',
    required: field.required,
    options: field.options
  }))
})

// Copy schema to clipboard
const copySchema = () => {
  navigator.clipboard
    .writeText(JSON.stringify(formSchema.value, null, 2))
    .then(() => alert('Schema copied to clipboard'))
    .catch((err) => console.error('Failed to copy schema:', err))
}

// Submit the form
const submitForm = () => {
  console.log('Form submitted:', formData)
  formSubmitted.value = true

  // In a real app, you would send the data to your backend here
}
</script>
