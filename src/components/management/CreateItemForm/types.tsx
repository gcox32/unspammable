export interface Field {
    name: string;
    label: string | React.ReactNode;
    type: 'text' | 'textarea' | 'select' | 'multiselect' | 'url' | 'section' | 'number' | 'boolean';
    options?: (string | { value: string, label: string })[];
    required?: boolean;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    defaultValue?: string;
}

export interface CreateItemFormProps {
    fields: Field[];
    onSubmit: (formData: Record<string, any>) => Promise<void>;
    title: string;
    initialData?: Record<string, any>;
}