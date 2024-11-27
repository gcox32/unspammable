import Tooltip from '../Tooltip';

interface SectionFieldProps {
  field: {
    name: string;
    label: string;
    fields: Array<{
      name: string;
      label: string;
      type: 'text' | 'textarea' | 'select' | 'multiselect' | 'url' | 'number' | 'boolean';
      placeholder?: string;
      min?: number;
      max?: number;
      step?: number;
      tooltip?: string;
      options?: (string | { value: string, label: string })[];
      defaultValue?: string;
    }>;
  };
  value: Record<string, any>;
  onChange: (name: string, value: any) => void;
}

export default function SectionField({ field, value, onChange }: SectionFieldProps) {
  return (
    <fieldset className="form-section">
      <legend>{field.label}</legend>
      <div className="section-fields">
        {field.fields.map((subField) => (
          <div key={subField.name} className="input-group">
            <label 
              htmlFor={`${field.name}-${subField.name}`}
              className="input-label"
            >
              {subField.tooltip ? (
                <Tooltip text={subField.tooltip}>
                  {subField.label}
                </Tooltip>
              ) : (
                subField.label
              )}
            </label>
            {subField.type === 'boolean' ? (
              <input
                type="checkbox"
                id={`${field.name}-${subField.name}`}
                checked={value?.[subField.name] || false}
                onChange={(e) => 
                  onChange(field.name, { 
                    ...value, 
                    [subField.name]: e.target.checked 
                  })
                }
              />
            ) : subField.type === 'select' ? (
              <select
                id={`${field.name}-${subField.name}`}
                value={value?.[subField.name] || subField.defaultValue || ''}
                onChange={(e) => 
                  onChange(field.name, { 
                    ...value, 
                    [subField.name]: e.target.value 
                  })
                }
              >
                <option value="">Select {subField.label}</option>
                {subField.options?.map(option => (
                  <option 
                    key={typeof option === 'string' ? option : option.value} 
                    value={typeof option === 'string' ? option : option.value}
                  >
                    {typeof option === 'string' ? option : option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={subField.type}
                id={`${field.name}-${subField.name}`}
                value={value?.[subField.name] || ''}
                placeholder={subField.placeholder}
                min={subField.min}
                max={subField.max}
                step={subField.step}
                onChange={(e) => 
                  onChange(field.name, { 
                    ...value, 
                    [subField.name]: e.target.value 
                  })
                }
              />
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
} 