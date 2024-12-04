import { useState } from 'react';
import ComponentExerciseForm from './ComponentExerciseForm';
import ScoreConfiguration from './ScoreConfiguration';

export type ComponentStyle = 
  | 'AMRAP' 
  | 'FOR_TIME' 
  | 'EMOM' 
  | 'FIXED_ROUNDS' 
  | 'WORK_REST' 
  | 'SINGLE_SET' 
  | 'FACTORIAL'
  | 'REST' 
  | 'OTHER';

interface CreateComponentFormProps {
  onSubmit: (formData: {
    name: string;
    description?: string;
    sequenceOrder: number;
    style: ComponentStyle;
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
  submitButtonText?: string | React.ReactNode;
  disabled?: boolean;
}

export default function CreateComponentForm({ 
  onSubmit, 
  initialData,
  submitButtonText,
  disabled 
}: CreateComponentFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    sequenceOrder: initialData?.sequenceOrder || 1,
    style: initialData?.style || 'SINGLE_SET',
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
        <label htmlFor="style">Style</label>
        <select
          id="style"
          value={formData.style}
          onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value as ComponentStyle }))}
          required
        >
          <option value="SINGLE_SET">Single Set</option>
          <option value="AMRAP">AMRAP</option>
          <option value="FOR_TIME">For Time</option>
          <option value="EMOM">EMOM</option>
          <option value="FIXED_ROUNDS">Fixed Rounds</option>
          <option value="WORK_REST">Work/Rest</option>
          <option value="FACTORIAL">Factorial</option>
          <option value="REST">Rest</option>
          <option value="OTHER">Other</option>
        </select>
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

      <button 
        type="submit" 
        className="submit-button"
        disabled={disabled}
      >
        {submitButtonText || (initialData ? 'Update Component' : 'Create Component')}
      </button>
    </form>
  );
} 