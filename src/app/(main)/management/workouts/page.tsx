"use client";

import { useEffect, useState } from "react";
import AuthProtected from "@/src/components/auth/AuthProtected";
import type { Schema } from '@/amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import type { WorkoutTemplate } from '@/src/types/schema';
import '@/src/styles/management.css';
import BrowsingContainer from '@/src/components/management/BrowsingContainer';
import CreateWorkoutForm from "@/src/components/management/workouts/CreateWorkoutForm";
import WorkoutDetails from "@/src/components/management/workouts/WorkoutDetails";
import Snackbar from '@/src/components/Snackbar';
import type { SnackbarState } from '@/src/types/app';

const client = generateClient<Schema>();

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    show: false,
    message: '',
    type: 'error'
  });

  const fetchWorkouts = async () => {
    try {
      const { data: workoutData } = await client.models.WorkoutTemplate.list();
      
      // Fetch associated components for each workout
      const workoutsWithDetails = await Promise.all(
        workoutData.map(async (workout) => {
          // Get the WorkoutTemplateComponent records
          const { data: componentLinks } = await client.models.WorkoutTemplateComponent.list({
            filter: {
              workoutTemplateId: { eq: workout.id }
            }
          });

          // For each component link, fetch the full WorkoutComponentTemplate with exercises
          const componentsWithDetails = await Promise.all(
            componentLinks.map(async (link) => {
              const { data: componentData } = await client.models.WorkoutComponentTemplate.get({ 
                id: link.workoutComponentTemplateId 
              });

              // Fetch exercises for this component
              const { data: exerciseLinks } = await client.models.WorkoutComponentTemplateExercise.list({
                filter: { workoutComponentTemplateId: { eq: componentData?.id } }
              });

              // Fetch full exercise details
              const exercisesWithDetails = await Promise.all(
                exerciseLinks.map(async (exerciseLink) => {
                  const { data: exerciseData } = await client.models.ExerciseTemplate.get({
                    id: exerciseLink.exerciseTemplateId
                  });
                  return {
                    ...exerciseLink,
                    exercise: exerciseData
                  };
                })
              );

              // Return both formats
              return {
                id: link.id,
                ...componentData,  // For edit form
                exercises: exercisesWithDetails,  // For edit form
                workoutComponentTemplate: {  // For preview
                  ...componentData,
                  exercises: exercisesWithDetails
                }
              };
            })
          );
          
          return {
            ...workout,
            workoutComponentTemplates: componentsWithDetails
          };
        })
      );

      // @ts-ignore
      setWorkouts(workoutsWithDetails);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setError('Failed to fetch workouts');
      setLoading(false);
    }
  };

  const handleCreateWorkout = async (formData: Record<string, any>) => {
    try {
      console.log('Starting workout creation with formData:', formData);
      const { components, ...workoutData } = formData;

      // Generate a UUID for the workout
      const workoutId = crypto.randomUUID();

      // Create the workout template
      console.log('Creating WorkoutTemplate with data:', {
        id: workoutId,
        name: workoutData.name,
        description: workoutData.description
      });
      
      if (!workoutData.name) {
        throw new Error('Missing required field: name');
      }

      let newWorkout;
      try {
        const response = await client.models.WorkoutTemplate.create({
          id: workoutId,
          name: workoutData.name,
          description: workoutData.description || null
        });
        console.log('Raw response from create:', response);
        newWorkout = response.data;
      } catch (error) {
        console.error('Error creating workout:', error);
        throw error;
      }

      if (!newWorkout || !newWorkout.id) {
        throw new Error('Failed to create workout: No ID returned');
      }

      console.log('Created WorkoutTemplate:', newWorkout);

      try {
        // Create the component associations
        console.log('Starting component associations creation with:', components);
        const componentPromises = components?.length > 0
          ? components.map(async (component: { workoutComponentTemplateId: string }) => {
              if (!component.workoutComponentTemplateId) {
                console.log('Skipping component without workoutComponentTemplateId:', component);
                return null;
              }
              console.log('Creating component association for:', component);
              return client.models.WorkoutTemplateComponent.create({
                workoutTemplateId: newWorkout.id,
                workoutComponentTemplateId: component.workoutComponentTemplateId
              });
            }).filter(Boolean)
          : [];

        // Wait for all creations to complete
        console.log('Waiting for all promises to complete...');
        await Promise.all(componentPromises);
        console.log('All creation promises completed');

        // Fetch the complete workout with all relations
        const { data: componentLinks } = await client.models.WorkoutTemplateComponent.list({
          filter: { workoutTemplateId: { eq: newWorkout.id } }
        });

        // Fetch component details
        const componentsWithDetails = await Promise.all(
          componentLinks.map(async (link) => {
            const { data: componentData } = await client.models.WorkoutComponentTemplate.get({ 
              id: link.workoutComponentTemplateId 
            });

            // Fetch exercises for this component
            const { data: exerciseLinks } = await client.models.WorkoutComponentTemplateExercise.list({
              filter: { workoutComponentTemplateId: { eq: componentData?.id } }
            });

            // Fetch full exercise details
            const exercisesWithDetails = await Promise.all(
              exerciseLinks.map(async (exerciseLink) => {
                const { data: exerciseData } = await client.models.ExerciseTemplate.get({
                  id: exerciseLink.exerciseTemplateId
                });
                return {
                  ...exerciseLink,
                  exercise: exerciseData
                };
              })
            );

            return {
              id: link.id,
              workoutComponentTemplate: {
                ...componentData,
                exercises: exercisesWithDetails
              }
            };
          })
        );

        // Update local state with the complete workout
        // @ts-ignore
        setWorkouts(prev => [...prev, { ...newWorkout, workoutComponentTemplates: componentsWithDetails }]);

        setSnackbar({ show: true, message: 'Workout created successfully', type: 'success' });
        setTimeout(() => {
          setSnackbar({ show: false, message: '', type: 'error' });
        }, 3000);

        return newWorkout;

      } catch (error) {
        console.error('Inner try-catch error:', error);
        // @ts-ignore
        console.log('Attempting to clean up workout:', newWorkout.id);
        // @ts-ignore
        await client.models.WorkoutTemplate.delete({ id: newWorkout.id });
        throw error;
      }
    } catch (error) {
      console.error('Outer try-catch error:', error);
      setSnackbar({ show: true, message: 'Failed to create workout', type: 'error' });
      setTimeout(() => {
        setSnackbar({ show: false, message: '', type: 'error' });
      }, 3000);
      throw new Error('Failed to create workout');
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  return (
    <AuthProtected>
      {(user) => (
        <div className="management-page content">
          <div className="management-content">
            <div className="create-section">
              <h3>Create Workout</h3>
              <p className="content-description">Design new workout templates.</p>
              <CreateWorkoutForm onSubmit={handleCreateWorkout} />
              {snackbar.show && (
                <Snackbar 
                  message={snackbar.message}
                  type="success"
                  visible={snackbar.show}
                />
              )}
            </div>

            <div className="list-section">
              <h3>Available Workouts</h3>
              <p className="content-description">Browse and manage the workout library.</p>
              <BrowsingContainer 
                // @ts-ignore
                items={workouts}
                loading={loading}
                error={error}
                renderItem={(workout) => (
                  <div className="item-card">
                    <h4>{workout.name}</h4>
                    <div className="workout-components">
                      {/* @ts-ignore */}
                      {workout.workoutComponentTemplates?.length > 0 ? (
                          <span className="component-count">
                            {/* @ts-ignore */}
                            {workout.workoutComponentTemplates.length} component{workout.workoutComponentTemplates.length !== 1 ? 's' : ''}
                          </span>
                      ) : (
                        <span className="no-components">No components added</span>
                      )}
                    </div>
                  </div>
                )}
                renderItemDetails={(workout) => (
                  <WorkoutDetails
                    // @ts-ignore
                    workout={workout}
                    onUpdate={async (updatedWorkout) => {
                      await fetchWorkouts();
                    }}
                    onDelete={async (workoutId) => {
                      try {
                        // First delete all component associations
                        const { data: componentLinks } = await client.models.WorkoutTemplateComponent.list({
                          filter: { workoutTemplateId: { eq: workoutId } }
                        });

                        await Promise.all(
                          componentLinks.map(link =>
                            client.models.WorkoutTemplateComponent.delete({ id: link.id })
                          )
                        );

                        // Then delete the workout template
                        await client.models.WorkoutTemplate.delete({ id: workoutId });
                        setWorkouts(prev => prev.filter(w => w.id !== workoutId));
                        setSnackbar({ show: true, message: 'Workout deleted successfully', type: 'success' });
                        setTimeout(() => {
                          setSnackbar({ show: false, message: '', type: 'error' });
                        }, 3000);
                      } catch (error) {
                        console.error('Error deleting workout:', error);
                        setError('Failed to delete workout');
                      }
                    }}
                  />
                )}
                onItemUpdate={(updatedWorkout) => {}}
              />
            </div>
          </div>
        </div>
      )}
    </AuthProtected>
  );
} 