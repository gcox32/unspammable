"use client";

import { useEffect, useState } from "react";
import AuthProtected from "@/src/components/auth/AuthProtected";
import type { Schema } from '@/amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import type { WorkoutComponentTemplate } from '@/src/types/schema';
import '@/src/styles/management.css';
import BrowsingContainer from '@/src/components/management/BrowsingContainer';
import CreateComponentForm from "@/src/components/management/components/CreateComponentForm";
import Snackbar from '@/src/components/Snackbar';
import type { SnackbarState } from '@/src/types/app';
import { COMPONENT_FIELDS } from '@/src/types/workout';
import ComponentDetails from '@/src/components/management/components/ComponentDetails';
import ComponentExerciseForm from '@/src/components/management/components/ComponentExerciseForm';

const client = generateClient<Schema>()

export default function WorkoutComponentsPage() {
  const [components, setComponents] = useState<WorkoutComponentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    show: false,
    message: '',
    type: 'error'
  });

  const fetchComponents = async () => {
    try {
      const { data: componentData } = await client.models.WorkoutComponentTemplate.list();
      
      // Fetch associated exercises for each component
      const componentsWithExercises = await Promise.all(
        componentData.map(async (component) => {
          // Get the WorkoutComponentTemplateExercise records
          const { data: exerciseLinks } = await client.models.WorkoutComponentTemplateExercise.list({
            filter: {
              workoutComponentTemplateId: { eq: component.id }
            }
          });

          // For each link, fetch the full ExerciseTemplate
          const exercisesWithDetails = await Promise.all(
            exerciseLinks.map(async (link) => {
              const { data: exerciseData } = await client.models.ExerciseTemplate.get({ id: link.exerciseTemplateId });
              return {
                ...link,
                exercise: exerciseData
              };
            })
          );
          
          return {
            ...component,
            exercises: exercisesWithDetails
          };
        })
      );

      // Update local state
      // @ts-ignore
      setComponents(componentsWithExercises);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching workout components:', err);
      setError('Failed to load workout components');
      setLoading(false);
    }
  };

  const handleCreateComponent = async (formData: Record<string, any>) => {
    try {
      const { exercises, ...componentData } = formData;

      // Create the workout component template
      // @ts-ignore
      const { data: newComponent } = await client.models.WorkoutComponentTemplate.create({...componentData, workoutTemplateId: 'temp', sequenceOrder: parseInt(componentData.sequenceOrder)
      });

      // Create the exercise associations
      if (exercises && exercises.length > 0) {
        await Promise.all(
          exercises.map(async (exercise: any) => {
            if (exercise.exerciseTemplateId) {
              await client.models.WorkoutComponentTemplateExercise.create({
                // @ts-ignore
                workoutComponentTemplateId: newComponent.id,
                exerciseTemplateId: exercise.exerciseTemplateId,
                externalLoadPrimary: exercise.externalLoadPrimary,
                externalLoadSecondary: exercise.externalLoadSecondary,
                reps: exercise.reps,
                distance: exercise.distance,
                time: exercise.time,
                calories: exercise.calories
              });
            }
          })
        );
      }

      // Fetch the complete component with exercises for the local state
      const { data: exerciseLinks } = await client.models.WorkoutComponentTemplateExercise.list({
        // @ts-ignore
        filter: { workoutComponentTemplateId: { eq: newComponent.id } }
      });

      const exercisesWithDetails = await Promise.all(
        exerciseLinks.map(async (link) => {
          const { data: exerciseData } = await client.models.ExerciseTemplate.get({ 
            id: link.exerciseTemplateId 
          });
          return {
            ...link,
            exercise: exerciseData
          };
        })
      );

      // Update local state with the complete component
      // @ts-ignore
      setComponents(prev => [...prev, { ...newComponent, exercises: exercisesWithDetails }]);
      
      // Show success message
      setSnackbar({ show: true, message: 'Component created successfully' , type: 'success' });
      setTimeout(() => {
        setSnackbar({ show: false, message: '', type: 'error' });
      }, 3000);
      
      return newComponent;
    } catch (error) {
      console.error('Error creating component:', error);
      throw new Error('Failed to create component');
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  return (
    <AuthProtected>
      {(user) => (
        <div className="management-page content">
          <div className="management-content">
            <div className="create-section">
              <h3>Create Component</h3>
              <p className="content-description">Manage the building blocks of your workouts.</p>
              {/* @ts-ignore */}
              <CreateComponentForm onSubmit={handleCreateComponent} />
              {snackbar.show && (
                <Snackbar 
                  message={snackbar.message}
                  type="success"
                  visible={snackbar.show}
                />
              )}
            </div>

            <div className="list-section">
              <h3>Available Components</h3>
              <p className="content-description">Browse and manage the component library.</p>
              <BrowsingContainer 
                // @ts-ignore
                items={components}
                loading={loading}
                error={error}
                renderItem={(component) => (
                  <div className="item-card">
                    <h4>{component.name}</h4>
                    <div className="component-exercises">
                      {component.exercises?.length > 0 ? (
                          <span className="exercise-count">
                            {component.exercises.length} exercise{component.exercises.length !== 1 ? 's' : ''}
                          </span>
                      ) : (
                        <span className="no-exercises">No exercises added</span>
                      )}
                    </div>
                  </div>
                )}
                renderItemDetails={(component) => (
                  <ComponentDetails
                    // @ts-ignore
                    component={component}
                    onUpdate={async (updatedComponent) => {
                      await fetchComponents();
                    }}
                    onDelete={async (componentId) => {
                      try {
                        await client.models.WorkoutComponentTemplate.delete({ id: componentId });
                        setComponents(prev => prev.filter(c => c.id !== componentId));
                        setSnackbar({ show: true, message: 'Component deleted successfully', type: 'success' });
                        setTimeout(() => {
                          setSnackbar({ show: false, message: '', type: 'error' });
                        }, 3000);
                      } catch (error) {
                        console.error('Error deleting component:', error);
                        setError('Failed to delete component');
                      }
                    }}
                  />
                )}
                onItemUpdate={(updatedComponent) => {}}
              />
            </div>
          </div>
        </div>
      )}
    </AuthProtected>
  );
} 