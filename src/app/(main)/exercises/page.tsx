"use client";

import { useEffect, useState } from "react";
import AuthProtected from "@/src/components/AuthProtected";
import type { Schema } from '@/amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import type { ExerciseTemplate } from '@/src/types/schema';
import '../../../styles/management.css';
import BrowsingContainer from '@/src/components/BrowsingContainer';
import CreateItemForm from "@/src/components/CreateItemForm";

const client = generateClient<Schema>()

const EXERCISE_FIELDS = [
  {
    name: 'name',
    label: 'Exercise Name',
    type: 'text' as const,
    required: true,
    placeholder: 'e.g., Back Squat'
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea' as const,
    placeholder: 'Describe the exercise...'
  },
  {
    name: 'category',
    label: 'Category',
    type: 'select' as const,
    required: true,
    options: ['Strength', 'Cardio', 'Gymnastics', 'Olympic Lifting']
  },
  {
    name: 'equipment',
    label: 'Equipment Required',
    type: 'multiselect' as const,
    options: [
      'Barbell',
      'Dumbbell',
      'Kettlebell',
      'Pull-up Bar',
      'Rings',
      'Rower',
      'Bike',
      'Jump Rope',
      'None'
    ]
  },
  {
    name: 'videoUrl',
    label: 'Demo Video URL',
    type: 'url' as const,
    placeholder: 'https://...'
  },
  {
    name: 'outputConstants',
    label: 'Output Score Constants',
    type: 'section' as const,
    fields: [
      {
        name: 'bodyweightFactor',
        label: 'Bodyweight Factor',
        type: 'number' as const,
        placeholder: '0.0 to 1.0',
        min: 0,
        max: 1,
        step: 0.1,
        tooltip: 'Percentage of bodyweight used in force calculation'
      },
      {
        name: 'defaultDistance',
        label: 'Default Movement Distance (m)',
        type: 'number' as const,
        placeholder: 'e.g., 0.5',
        min: 0,
        step: 0.1,
        tooltip: 'Default distance of movement in meters'
      },
      {
        name: 'armLengthFactor',
        label: 'Arm Length Factor',
        type: 'number' as const,
        placeholder: '0.0 to 2.0',
        min: 0,
        max: 2,
        step: 0.1,
        tooltip: 'Multiplier for arm length in distance calculations'
      },
      {
        name: 'legLengthFactor',
        label: 'Leg Length Factor',
        type: 'number' as const,
        placeholder: '0.0 to 2.0',
        min: 0,
        max: 2,
        step: 0.1,
        tooltip: 'Multiplier for leg length in distance calculations'
      },
      {
        name: 'useCalories',
        label: 'Use Calories for Work Calculation',
        type: 'boolean' as const,
        tooltip: 'Use machine-reported calories instead of force × distance'
      }
    ]
  }
];

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<ExerciseTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExercises() {
      try {
        const { data } = await client.models.ExerciseTemplate.list();
        // @ts-ignore
        setExercises(data as ExerciseTemplate[]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching exercises:', err);
        setError('Failed to load exercises');
        setLoading(false);
      }
    }

    fetchExercises();
  }, []);

  const handleCreateExercise = async (formData: Record<string, any>) => {
    try {
      const { outputConstants, ...exerciseData } = formData;
      
      // First create the exercise template
      // @ts-ignore
      const { data: newExercise } = await client.models.ExerciseTemplate.create({...exerciseData});

      // Then create the associated output constants
      if (outputConstants) {
        await client.models.ExerciseOutputConstants.create({
          // @ts-ignore
          ...outputConstants, exerciseTemplateId: newExercise.id
        });
      }

      // Update local state
      // @ts-ignore
      setExercises(prev => [...prev, newExercise]);
      
      return newExercise;
    } catch (error) {
      console.error('Error creating exercise:', error);
      throw new Error('Failed to create exercise');
    }
  };

  return (
    <AuthProtected>
      {(user) => (
        <div className="exercises-page content">
          <div className="exercises-content">
            {/* Left Section - Create Exercise */}
            <div className="create-exercise-section">
              <h3>Create Exercise</h3>
              <p className="content-description">Add a new exercise to your library.</p>
              <CreateItemForm
                // @ts-ignore
                fields={EXERCISE_FIELDS}
                // @ts-ignore
                onSubmit={handleCreateExercise}
                title="Create Exercise"
              />
            </div>

            {/* Right Section - Exercise Library */}
            <div className="list-exercises-section">
              <h3>Exercise Library</h3>
              <p className="content-description">Browse and manage your exercise collection.</p>
              <BrowsingContainer 
                items={exercises}
                loading={loading}
                error={error}
                renderItem={(exercise) => (
                  <div className="item-card">
                    <h4>{exercise.name}</h4>
                    {exercise.category && <span className="category-pill" data-category={exercise.category.toLowerCase()}>{exercise.category.toLowerCase()}</span>}
                  </div>
                )}
                renderItemDetails={(exercise) => (
                  <div className="list-exercise-details">
                    {exercise.description && <p>{exercise.description}</p>}
                    {exercise.category && (
                      <div className="detail-row">
                        <strong>Category:</strong> {exercise.category}
                      </div>
                    )}
                    {exercise.equipment && exercise.equipment.length > 0 && (
                      <div className="detail-row">
                        <strong>Equipment:</strong>
                        <div className="equipment-tags">
                          {exercise.equipment.map((item, index) => (
                            <span key={index} className="equipment-tag">{item}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {exercise.videoUrl && (
                      <div className="detail-row">
                        <a href={exercise.videoUrl} target="_blank" rel="noopener noreferrer" 
                           className="video-link">
                          Watch Demo Video
                        </a>
                      </div>
                    )}
                    {exercise.outputConstants && (
                      <div className="detail-row">
                        <strong>Output Configuration:</strong>
                        <div className="output-constants">
                          {exercise.outputConstants.bodyweightFactor && (
                            <div>Bodyweight Factor: {exercise.outputConstants.bodyweightFactor}</div>
                          )}
                          {exercise.outputConstants.defaultDistance && (
                            <div>Default Distance: {exercise.outputConstants.defaultDistance}m</div>
                          )}
                          {exercise.outputConstants.armLengthFactor && (
                            <div>Arm Length Factor: {exercise.outputConstants.armLengthFactor}</div>
                          )}
                          {exercise.outputConstants.legLengthFactor && (
                            <div>Leg Length Factor: {exercise.outputConstants.legLengthFactor}</div>
                          )}
                          {exercise.outputConstants.useCalories && (
                            <div>Uses Calories for Work Calculation</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      )}
    </AuthProtected>
  );
} 