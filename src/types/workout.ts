export const COMPONENT_FIELDS = [
  {
    name: 'name',
    label: 'Component Name',
    type: 'text' as const,
    required: true,
    placeholder: 'e.g., Strength Complex A'
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea' as const,
    placeholder: 'Describe the workout component'
  },
  {
    name: 'sequenceOrder',
    label: 'Sequence Order',
    type: 'number' as const,
    required: true,
    min: 1,
    placeholder: 'Order in workout'
  }
]; 