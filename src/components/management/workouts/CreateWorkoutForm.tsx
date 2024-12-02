import { useState } from 'react';
import type { WorkoutComponentTemplate } from '@/src/types/schema';
import WorkoutComponentSelection from './WorkoutComponentSelection';

interface CreateWorkoutFormProps {
  onSubmit: (formData: {
    name: string;
    description?: string;
    components: Array<{
      workoutComponentTemplateId: string;
    }>;
  }) => Promise<any>;
  initialData?: any;
}

export default function CreateWorkoutForm({ onSubmit, initialData }: CreateWorkoutFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    components: initialData?.workoutComponentTemplates?.map((component: WorkoutComponentTemplate) => ({
      workoutComponentTemplateId: component.id
    })) || []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="create-form">
      <div className="form-field">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div className="form-field">
        <fieldset className="form-section">
          <legend>Components</legend>
          <WorkoutComponentSelection
            onChange={(components) => setFormData(prev => ({ ...prev, components }))}
            initialComponents={initialData?.workoutComponentTemplates}
          />
        </fieldset>
      </div>

      <button type="submit" className="submit-button">
        {initialData ? 'Update Workout' : 'Create Workout'}
      </button>
    </form>
  );
} 