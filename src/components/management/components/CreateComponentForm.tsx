import { useState } from 'react';
import ComponentExerciseForm from './ComponentExerciseForm';
import type { WorkoutComponentTemplate } from '@/src/types/schema';

interface CreateComponentFormProps {
  onSubmit: (formData: {
    name: string;
    description?: string;
    sequenceOrder: number;
    exercises: Array<{
      exerciseTemplateId: string;
      externalLoadPrimary?: number;
      externalLoadSecondary?: number;
      reps?: number;
      distance?: number;
      time?: number;
      calories?: number;
    }>;
  }) => Promise<void>;
}

export default function CreateComponentForm({ onSubmit }: CreateComponentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sequenceOrder: 1,
    exercises: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      setFormData({
        name: '',
        description: '',
        sequenceOrder: 1,
        exercises: []
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-form">
      <h3>Create Component</h3>
      
      <div className="form-field">
        <label>Component Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Strength Complex A"
          required
        />
      </div>

      <div className="form-field">
        <label>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the workout component"
        />
      </div>

      <div className="form-field">
        <label>Sequence Order</label>
        <input
          type="number"
          value={formData.sequenceOrder}
          onChange={(e) => setFormData(prev => ({ ...prev, sequenceOrder: parseInt(e.target.value) }))}
          min={1}
          required
        />
      </div>

      <div className="form-field">
        <label>Exercises</label>
        <ComponentExerciseForm
          // @ts-ignore
          onChange={(exercises) => setFormData(prev => ({ ...prev, exercises }))}
        />
      </div>

      <button type="submit" className="submit-button">Create Component</button>
    </form>
  );
} 