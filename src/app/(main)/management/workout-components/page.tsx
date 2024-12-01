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
      
      // Fetch associated exercises and scores for each component
      const componentsWithDetails = await Promise.all(
        componentData.map(async (component) => {
          // Get the WorkoutComponentTemplateExercise records
          const { data: exerciseLinks } = await client.models.WorkoutComponentTemplateExercise.list({
            filter: {
              workoutComponentTemplateId: { eq: component.id }
            }
          });

          // Get the WorkoutComponentTemplateScore records
          const { data: scoreData } = await client.models.WorkoutComponentTemplateScore.list({
            filter: {
              workoutComponentTemplateId: { eq: component.id }
            }
          });

          // For each exercise link, fetch the full ExerciseTemplate
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

          // For each score, fetch its measures
          const scoresWithMeasures = await Promise.all(
            scoreData.map(async (score) => {
              const { data: measures } = await client.models.Measure.list({
                filter: { 
                  workoutComponentTemplateScoreId: { eq: score.id } 
                }
              });
              return {
                ...score,
                measures
              };
            })
          );
          
          return {
            ...component,
            exercises: exercisesWithDetails,
            scores: scoresWithMeasures
          };
        })
      );

      // Update local state
      // @ts-ignore
      setComponents(componentsWithDetails);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching workout components:', err);
      setError('Failed to load workout components');
      setLoading(false);
    }
  };

  const handleCreateComponent = async (formData: Record<string, any>) => {
    try {
      console.log('Starting component creation with formData:', formData);
      const { exercises, scores, ...componentData } = formData;

      // Generate a UUID for the component
      const componentId = crypto.randomUUID();

      // Create the workout component template with only the allowed fields
      console.log('Creating WorkoutComponentTemplate with data:', {
        id: componentId,
        name: componentData.name,
        description: componentData.description,
        sequenceOrder: parseInt(componentData.sequenceOrder)
      });
      
      if (!componentData.name || !componentData.sequenceOrder) {
        throw new Error('Missing required fields: name and sequenceOrder');
      }

      let newComponent;
      try {
        const response = await client.models.WorkoutComponentTemplate.create({
          id: componentId,
          name: componentData.name,
          description: componentData.description || null,
          sequenceOrder: parseInt(componentData.sequenceOrder)
        });
        console.log('Raw response from create:', response);
        newComponent = response.data;
      } catch (error) {
        console.error('Error creating component:', error);
        throw error;
      }

      if (!newComponent || !newComponent.id) {
        throw new Error('Failed to create component: No ID returned');
      }

      console.log('Created WorkoutComponentTemplate:', newComponent);

      try {
        // Create the exercise associations
        console.log('Starting exercise associations creation with:', exercises);
        const exercisePromises = exercises?.length > 0
          ? exercises.map(async (exercise: any) => {
              if (!exercise.exerciseTemplateId) {
                console.log('Skipping exercise without exerciseTemplateId:', exercise);
                return null;
              }
              console.log('Creating exercise association for:', exercise);
              return client.models.WorkoutComponentTemplateExercise.create({
                workoutComponentTemplateId: newComponent.id,
                exerciseTemplateId: exercise.exerciseTemplateId,
                externalLoadPrimary: exercise.externalLoadPrimary || null,
                externalLoadSecondary: exercise.externalLoadSecondary || null,
                reps: exercise.reps || null,
                distance: exercise.distance || null,
                time: exercise.time || null,
                calories: exercise.calories || null
              });
            }).filter(Boolean)
          : [];

        // Create the scoring configuration
        console.log('Starting score configuration creation with:', scores);
        const scorePromises = scores?.length > 0
          ? (async () => {
              // @ts-ignore
              console.log('Creating score template for component:', newComponent.id);
              const { data: scoreTemplate } = await client.models.WorkoutComponentTemplateScore.create({
                // @ts-ignore
                workoutComponentTemplateId: newComponent.id
              });

              console.log('Created score template:', scoreTemplate);

              // Then create each measure
              return Promise.all(
                scores.map(async (score: { type: string; unit: string; label: string }) => {
                  console.log('Creating measure for score template:', score);
                  return client.models.Measure.create({
                    // @ts-ignore
                    workoutComponentTemplateScoreId: scoreTemplate.id,
                    type: score.type,
                    unit: score.unit,
                    label: score.label
                  });
                })
              );
            })()
          : Promise.resolve([]);

        // Wait for all creations to complete
        console.log('Waiting for all promises to complete...');
        await Promise.all([...exercisePromises, scorePromises]);
        console.log('All creation promises completed');

        // Fetch the complete component with all relations
        const [exerciseLinks, scoreData] = await Promise.all([
          client.models.WorkoutComponentTemplateExercise.list({
            // @ts-ignore
            filter: { workoutComponentTemplateId: { eq: newComponent.id } }
          }),
          client.models.WorkoutComponentTemplateScore.list({
            // @ts-ignore
            filter: { workoutComponentTemplateId: { eq: newComponent.id } }
          })
        ]);

        // Fetch exercise details
        const exercisesWithDetails = await Promise.all(
          exerciseLinks.data.map(async (link) => {
            const { data: exerciseData } = await client.models.ExerciseTemplate.get({ 
              id: link.exerciseTemplateId 
            });
            return {
              ...link,
              exercise: exerciseData
            };
          })
        );

        // Fetch measure details for each score
        const scoresWithMeasures = await Promise.all(
          scoreData.data.map(async (score) => {
            const { data: measures } = await client.models.Measure.list({
              filter: { workoutComponentTemplateScoreId: { eq: score.id } }
            });
            return {
              ...score,
              measures
            };
          })
        );

        // Update local state with the complete component
        // @ts-ignore
        setComponents(prev => [...prev, { ...newComponent, exercises: exercisesWithDetails, scores: scoresWithMeasures }]);

        setSnackbar({ show: true, message: 'Component created successfully', type: 'success' });
        setTimeout(() => {
          setSnackbar({ show: false, message: '', type: 'error' });
        }, 3000);

        return newComponent;

      } catch (error) {
        console.error('Inner try-catch error:', error);
        // @ts-ignore
        console.log('Attempting to clean up component:', newComponent.id);
        // @ts-ignore
        await client.models.WorkoutComponentTemplate.delete({ id: newComponent.id });
        throw error;
      }
    } catch (error) {
      console.error('Outer try-catch error:', error);
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