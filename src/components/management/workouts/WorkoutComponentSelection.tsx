import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import type { WorkoutComponentTemplate } from '@/src/types/schema';

interface WorkoutComponentSelectionProps {
  onChange: (components: Array<{
    workoutComponentTemplateId: string;
  }>) => void;
  initialComponents?: Array<any>;
}

const client = generateClient<Schema>();

export default function WorkoutComponentSelection({ onChange, initialComponents }: WorkoutComponentSelectionProps) {
  const [components, setComponents] = useState<WorkoutComponentTemplate[]>([]);
  const [selectedComponents, setSelectedComponents] = useState<Array<{
    workoutComponentTemplateId: string;
  }>>(initialComponents?.map(component => ({
    workoutComponentTemplateId: component.id
  })) || []);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const { data } = await client.models.WorkoutComponentTemplate.list();
        // @ts-ignore
        setComponents(data);
      } catch (error) {
        console.error('Error fetching components:', error);
      }
    };
    fetchComponents();
  }, []);

  const handleAddComponent = () => {
    const newComponent = {
      workoutComponentTemplateId: ''
    };
    setSelectedComponents([...selectedComponents, newComponent]);
    onChange([...selectedComponents, newComponent]);
  };

  const handleComponentChange = (index: number, componentId: string) => {
    const updatedComponents = selectedComponents.map((component, i) => {
      if (i === index) {
        return { ...component, workoutComponentTemplateId: componentId };
      }
      return component;
    });
    setSelectedComponents(updatedComponents);
    onChange(updatedComponents);
  };

  const handleRemoveComponent = (index: number) => {
    const updatedComponents = selectedComponents.filter((_, i) => i !== index);
    setSelectedComponents(updatedComponents);
    onChange(updatedComponents);
  };

  return (
    <div className="workout-component-selection">
      {selectedComponents.map((selected, index) => (
        <div key={index} className="component-selection-row">
          <select
            value={selected.workoutComponentTemplateId}
            onChange={(e) => handleComponentChange(index, e.target.value)}
            required
          >
            <option value="">Select a component</option>
            {components.map((component) => (
              <option key={component.id} value={component.id}>
                {component.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => handleRemoveComponent(index)}
            className="remove-button"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddComponent}
        className="add-button"
      >
        + Add Component
      </button>
    </div>
  );
} 