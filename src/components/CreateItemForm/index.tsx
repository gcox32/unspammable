import { useState } from 'react';
import SectionField from './SectionField';

interface Field {
  name: string;
  label: string | React.ReactNode;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'url' | 'section' | 'number' | 'boolean';
  options?: string[];
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

interface CreateItemFormProps {
  fields: Field[];
  onSubmit: (formData: Record<string, any>) => Promise<void>;
  title: string;
}

export default function CreateItemForm({ fields, onSubmit, title }: CreateItemFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      setFormData({}); // Reset form after successful submission
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-item-form">
      {error && <div className="error-message">{error}</div>}
      
      {fields.map((field) => (
        <div key={field.name} className="form-field">
          {field.type === 'section' ? (
            <SectionField
              // @ts-ignore
              field={field}
              value={formData[field.name] || {}}
              onChange={(name, value) => {
                setFormData(prev => ({
                  ...prev,
                  [name]: value
                }));
              }}
            />
          ) : (
            <>
              <label htmlFor={field.name}>{field.label}</label>
              
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                  placeholder={field.placeholder}
                />
              ) : field.type === 'select' ? (
                <select
                  id={field.name}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : field.type === 'multiselect' ? (
                <select
                  id={field.name}
                  multiple
                  value={formData[field.name] || []}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions).map(opt => opt.value);
                    handleChange(field.name, values);
                  }}
                  required={field.required}
                >
                  {field.options?.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : field.type === 'number' ? (
                <input
                  type={field.type}
                  id={field.name}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                  placeholder={field.placeholder}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                />
              ) : field.type === 'boolean' ? (
                <input
                  type={field.type}
                  id={field.name}
                  checked={formData[field.name] || false}
                  onChange={(e) => handleChange(field.name, e.target.checked)}
                  required={field.required}
                />
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                  placeholder={field.placeholder}
                />
              )}
            </>
          )}
        </div>
      ))}

      <button 
        type="submit" 
        className="submit-button"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
} 