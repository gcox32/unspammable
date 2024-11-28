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
import Snackbar from '@/src/components/Snackbar';

const client = generateClient<Schema>()

interface SnackbarState {
  show: boolean;
  message: string;
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<ExerciseTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    show: false,
    message: ''
  });

  const fetchExercises = async () => {
    try {
      const { data: exerciseData } = await client.models.ExerciseTemplate.list();
      
      const exercisesWithConstants = await Promise.all(
        exerciseData.map(async (exercise) => {
          const { data: constantsData } = await client.models.ExerciseOutputConstants.list({
            filter: {
              exerciseTemplateId: { eq: exercise.id }
            }
          });
          
          return {
            ...exercise,
            outputConstants: constantsData[0] || null
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
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleUpdateExercise = async (updatedExercise: ExerciseTemplate) => {
    await fetchExercises(); // Refresh the entire list after an update
    return updatedExercise; // Return the updated exercise
  };

  const handleCreateExercise = async (formData: Record<string, any>) => {
    try {
      const { outputConstants, ...exerciseData } = formData;
      
      // Transform the calculation method selection into boolean
      if (outputConstants) {
        outputConstants.useCalories = outputConstants.useCalories === 'calories';
      }

      // Transform unilateral selection into boolean
      exerciseData.unilateral = exerciseData.unilateral === 'unilateral';

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
      
      // Show success message
      setSnackbar({ show: true, message: 'Exercise created successfully' });
      setTimeout(() => {
        setSnackbar({ show: false, message: '' });
      }, 3000);
      
      return newExercise;
    } catch (error) {
      console.error('Error creating exercise:', error);
      throw new Error('Failed to create exercise');
    }
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    try {
      // First delete associated output constants if they exist
      const { data: constantsData } = await client.models.ExerciseOutputConstants.list({
        filter: {
          exerciseTemplateId: { eq: exerciseId }
        }
      });

      if (constantsData[0]) {
        await client.models.ExerciseOutputConstants.delete({
          id: constantsData[0].id
        });
      }

      // Then delete the exercise template
      await client.models.ExerciseTemplate.delete({
        id: exerciseId
      });

      // Update local state
      setExercises(prev => prev.filter(exercise => exercise.id !== exerciseId));
      
      // Show success message
      setSnackbar({ show: true, message: 'Exercise deleted successfully' });
      setTimeout(() => {
        setSnackbar({ show: false, message: '' });
      }, 3000);

      // Close the modal by returning true
      return true;
    } catch (error) {
      console.error('Error deleting exercise:', error);
      throw new Error('Failed to delete exercise');
    }
  };

  const renderItemDetails = (exercise: ExerciseTemplate, onModalUpdate: (item: ExerciseTemplate | null) => void) => (
    <ExerciseDetails 
      exercise={exercise}
      onUpdate={async (updatedExercise) => {
        await handleUpdateExercise(updatedExercise);
        onModalUpdate(updatedExercise);
      }}
      onDelete={async (exerciseId) => {
        const success = await handleDeleteExercise(exerciseId);
        if (success) {
          onModalUpdate(null); // This will trigger the modal to close
        }
      }}
    />
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
              {snackbar.show && (
                <Snackbar 
                  message={snackbar.message}
                  type="success"
                  visible={snackbar.show}
                />
              )}
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
                onItemUpdate={(updatedExercise) => {}}
              />
            </div>
          </div>
        </div>
      )}
    </AuthProtected>
  );
} 