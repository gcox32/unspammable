import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import type { ExerciseTemplate } from '@/src/types/schema';

interface ComponentExerciseFormProps {
  onChange: (exercises: Array<{
    exerciseTemplateId: string;
    externalLoadPrimary?: number;
    externalLoadSecondary?: number;
    reps?: number;
    distance?: number;
    time?: number;
    calories?: number;
  }>) => void;
  initialExercises?: Array<any>;
}

const client = generateClient<Schema>();

export default function ComponentExerciseForm({ onChange, initialExercises }: ComponentExerciseFormProps) {
  const [exercises, setExercises] = useState<ExerciseTemplate[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Array<{
    exerciseTemplateId: string;
    externalLoadPrimary?: number;
    externalLoadSecondary?: number;
    reps?: number;
    distance?: number;
    time?: number;
    calories?: number;
  }>>(initialExercises?.map(ex => ({
    exerciseTemplateId: ex.exerciseTemplateId || ex.exercise?.id,
    externalLoadPrimary: ex.externalLoadPrimary,
    externalLoadSecondary: ex.externalLoadSecondary,
    reps: ex.reps,
    distance: ex.distance,
    time: ex.time,
    calories: ex.calories
  })) || []);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const { data } = await client.models.ExerciseTemplate.list();
        // @ts-ignore
        setExercises(data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };
    fetchExercises();
  }, []);

  const handleAddExercise = () => {
    const newExercise = {
      exerciseTemplateId: '',
      externalLoadPrimary: undefined,
      externalLoadSecondary: undefined,
      reps: undefined,
      distance: undefined,
      time: undefined,
      calories: undefined
    };
    setSelectedExercises([...selectedExercises, newExercise]);
    onChange([...selectedExercises, newExercise]);
  };

  const handleExerciseChange = (index: number, field: string, value: any) => {
    const updatedExercises = selectedExercises.map((exercise, i) => {
      if (i === index) {
        return { ...exercise, [field]: value };
      }
      return exercise;
    });
    setSelectedExercises(updatedExercises);
    onChange(updatedExercises);
  };

  const handleRemoveExercise = (index: number) => {
    const updatedExercises = selectedExercises.filter((_, i) => i !== index);
    setSelectedExercises(updatedExercises);
    onChange(updatedExercises);
  };

  return (
    <div className="section-fields">
      <div className="exercise-list">
        {selectedExercises.map((exercise, index) => (
          <div key={index} className="exercise-item">
            <select
              value={exercise.exerciseTemplateId}
              onChange={(e) => handleExerciseChange(index, 'exerciseTemplateId', e.target.value)}
              required
            >
              <option value="">Select Exercise</option>
              {exercises.map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>

            <div className="measures-grid">
              <div className="measure-input">
                <label>Reps</label>
                <input
                  type="number"
                  value={exercise.reps || ''}
                  onChange={(e) => handleExerciseChange(index, 'reps', parseInt(e.target.value))}
                />
              </div>
              <div className="measure-input">
                <label>Load (kg)</label>
                <input
                  type="number"
                  value={exercise.externalLoadPrimary || ''}
                  onChange={(e) => handleExerciseChange(index, 'externalLoadPrimary', parseFloat(e.target.value))}
                />
              </div>
              <div className="measure-input">
                <label>Distance (m)</label>
                <input
                  type="number"
                  value={exercise.distance || ''}
                  onChange={(e) => handleExerciseChange(index, 'distance', parseFloat(e.target.value))}
                />
              </div>
              <div className="measure-input">
                <label>Time (s)</label>
                <input
                  type="number"
                  value={exercise.time || ''}
                  onChange={(e) => handleExerciseChange(index, 'time', parseFloat(e.target.value))}
                />
              </div>
            </div>

            <button 
              type="button" 
              className="remove-button"
              onClick={() => handleRemoveExercise(index)}
            >
              Remove Exercise
            </button>
          </div>
        ))}
      </div>

      <button 
        type="button" 
        className="add-button"
        onClick={handleAddExercise}
      >
        Add Exercise
      </button>
    </div>
  );
} 