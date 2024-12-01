import { useState } from 'react';
import ComponentExerciseForm from './ComponentExerciseForm';
import ScoreConfiguration from './ScoreConfiguration';

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
    scores: Array<{
      type: string;
      unit: string;
      label: string;
    }>;
  }) => Promise<void>;
  initialData?: any;
}

export default function CreateComponentForm({ onSubmit, initialData }: CreateComponentFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    sequenceOrder: initialData?.sequenceOrder || 1,
    exercises: initialData?.exercises || [],
    scores: initialData?.scores?.map((score: any) => ({
      type: score.measures?.[0]?.type || '',
      unit: score.measures?.[0]?.unit || '',
      label: score.measures?.[0]?.label || ''
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
        <label htmlFor="sequenceOrder">Sequence Order</label>
        <input
          type="number"
          id="sequenceOrder"
          value={formData.sequenceOrder}
          onChange={(e) => setFormData(prev => ({ ...prev, sequenceOrder: parseInt(e.target.value) }))}
          min={1}
          required
        />
      </div>

      <div className="form-field">
        <fieldset className="form-section">
          <legend>Exercises</legend>
          <ComponentExerciseForm
            // @ts-ignore
            onChange={(exercises) => setFormData(prev => ({ ...prev, exercises }))}
            initialExercises={initialData?.exercises}
          />
        </fieldset>
      </div>

      <div className="form-field">
        <fieldset className="form-section">
          <legend>Scoring</legend>
          <ScoreConfiguration
            // @ts-ignore
            onScoreChange={(scores) => setFormData(prev => ({ ...prev, scores }))}
          />
        </fieldset>
      </div>

      <button type="submit" className="submit-button">Create Component</button>
    </form>
  );
} 