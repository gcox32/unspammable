interface SectionFieldProps {
  field: {
    name: string;
    label: string;
    fields: Array<{
      name: string;
      label: string;
      type: string;
      placeholder?: string;
      min?: number;
      max?: number;
      step?: number;
      tooltip?: string;
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
              title={subField.tooltip}
              className="input-label"
            >
              {subField.label}
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
            {subField.tooltip && (
              <div className="field-tooltip">ⓘ {subField.tooltip}</div>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
} 