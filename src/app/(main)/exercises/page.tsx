"use client";

import { useEffect, useState } from "react";
import AuthProtected from "@/src/components/AuthProtected";
import type { Schema } from '@/amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import type { ExerciseTemplate } from '@/src/types/schema';
import '../../../styles/management.css';
import BrowsingContainer from '@/src/components/BrowsingContainer';
import CreateItemForm from "@/src/components/CreateItemForm";
import { EXERCISE_FIELDS } from '@/src/types/exercise';
import ExerciseDetails from '@/src/components/ExerciseDetails';

const client = generateClient<Schema>()

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<ExerciseTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExercises() {
      try {
        // Fetch exercises
        const { data: exerciseData } = await client.models.ExerciseTemplate.list();
        
        // Fetch output constants for all exercises
        const exercisesWithConstants = await Promise.all(
          exerciseData.map(async (exercise) => {
            const { data: constantsData } = await client.models.ExerciseOutputConstants.list({
              filter: {
                exerciseTemplateId: { eq: exercise.id }
              }
            });
            
            return {
              ...exercise,
              outputConstants: constantsData[0] || null // Take first match if exists
            };
          })
        );

        // @ts-ignore
        setExercises(exercisesWithConstants);
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
      
      // Transform the calculation method selection into boolean
      if (outputConstants) {
        outputConstants.useCalories = outputConstants.useCalories === 'calories';
      }

      // First create the exercise template
      // @ts-ignore
      const { data: newExercise } = await client.models.ExerciseTemplate.create({...exerciseData});

      // Then create the associated output constants
      if (outputConstants) {
        // @ts-ignore
        await client.models.ExerciseOutputConstants.create({...outputConstants, exerciseTemplateId: newExercise.id
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

  const renderItemDetails = (exercise: ExerciseTemplate) => (
    <ExerciseDetails exercise={exercise} />
  );

  return (
    <AuthProtected>
      {(user) => (
        <div className="exercises-page content">
          <div className="exercises-content">
            {/* Left Section - Create Exercise */}
            <div className="create-section">
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
            <div className="list-section">
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
                renderItemDetails={renderItemDetails}
              />
            </div>
          </div>
        </div>
      )}
    </AuthProtected>
  );
} 