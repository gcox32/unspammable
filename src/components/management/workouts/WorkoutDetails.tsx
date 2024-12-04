import { useState } from 'react';
import { WorkoutTemplate } from '@/src/types/schema';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import CreateWorkoutForm from './CreateWorkoutForm';
import { WorkoutComponentTemplate } from '@/src/types/schema';
import Snackbar from '@/src/components/Snackbar';
import type { SnackbarState } from '@/src/types/app';
import { Spinner } from '@/src/components/Spinner';

interface WorkoutDetailsProps {
  workout: WorkoutTemplate;
  onUpdate?: (updatedWorkout: WorkoutTemplate) => void;
  onDelete?: (workoutId: string) => void;
}

const client = generateClient<Schema>();

export default function WorkoutDetails({ workout, onUpdate, onDelete }: WorkoutDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    show: false,
    message: '',
    type: 'error'
  });

  const handleUpdate = async (formData: Record<string, any>) => {
    setIsUpdating(true);
    try {
      const { components, ...workoutData } = formData;

      // Update the workout template
      const { data: updatedWorkout } = await client.models.WorkoutTemplate.update({
        id: workout.id,
        ...workoutData
      });

      // Handle component updates
      if (components && components.length > 0) {
        // First, delete existing component associations
        const { data: existingComponents } = await client.models.WorkoutTemplateComponent.list({
          filter: { workoutTemplateId: { eq: workout.id } }
        });

        await Promise.all(
          existingComponents.map(component =>
            client.models.WorkoutTemplateComponent.delete({ id: component.id })
          )
        );

        // Create new component associations
        await Promise.all(
          components.map(async (component: { workoutComponentTemplateId: string }) => {
            await client.models.WorkoutTemplateComponent.create({
              workoutTemplateId: workout.id,
              workoutComponentTemplateId: component.workoutComponentTemplateId
            });
          })
        );
      }

      // Fetch updated workout with all relations
      const { data: componentLinks } = await client.models.WorkoutTemplateComponent.list({
        filter: { workoutTemplateId: { eq: workout.id } }
      });

      // Fetch component details with their exercises
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

      // Notify parent component of update with complete data
      if (onUpdate) {
        await onUpdate({
          ...updatedWorkout,
          // @ts-ignore
          workoutComponentTemplates: componentsWithDetails
        });
      }

      setSnackbar({
        show: true,
        message: 'Workout updated successfully',
        type: 'success'
      });
      setTimeout(() => {
        setSnackbar(prev => ({ ...prev, show: false }));
      }, 3000);
      setIsUpdating(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating workout:', error);
      setSnackbar({
        show: true,
        message: 'Failed to update workout',
        type: 'error'
      });
      setTimeout(() => {
        setSnackbar(prev => ({ ...prev, show: false }));
      }, 3000);
      throw new Error('Failed to update workout');
    }
  };

  if (isEditing) {
    return (
      <div className="workout-edit-form">
        <div className="edit-header">
          <h4>Edit Workout</h4>
          <button 
            className="cancel-button"
            onClick={() => setIsEditing(false)}
            disabled={isUpdating}
          >
            Cancel
          </button>
        </div>
        <CreateWorkoutForm
          onSubmit={handleUpdate}
          initialData={workout}
          submitButtonText={isUpdating ? <Spinner /> : "Update Workout"}
          disabled={isUpdating}
        />
      </div>
    );
  }

  return (
    <div className="workout-details">
      <div className="details-header">
        <h4>Summary</h4>
        <div className="header-buttons">
          <button onClick={() => setIsEditing(true)} className="edit-button">
            Edit
          </button>
          <button onClick={() => setShowDeleteConfirm(true)} className="delete-button">
            Delete
          </button>
        </div>
      </div>

      {workout.description && (
        <p className="workout-description">{workout.description}</p>
      )}

      <div className="components-section">
        <h4>Components</h4>
        {workout.workoutComponentTemplates && workout.workoutComponentTemplates.length > 0 ? (
          <ul className="components-list">
            {workout.workoutComponentTemplates.map((componentLink, index) => {
              const component = componentLink.workoutComponentTemplate;
              return (
                <li key={`${componentLink.id}-${index}`} className="component-item">
                  <h5>{component?.name}</h5>
                  {component?.description && (
                    <p className="component-description">{component.description}</p>
                  )}
                  {component?.exercises && component.exercises.length > 0 && (
                    <div className="exercises-list">
                      {component.exercises.map((exerciseLink) => (
                        <div key={exerciseLink.id} className="exercise-item">
                          <span className="exercise-name">{exerciseLink.exercise?.name}</span>
                          <div className="exercise-measures">
                            {exerciseLink.reps && <span className="measure">Reps: {exerciseLink.reps}</span>}
                            {exerciseLink.externalLoadPrimary && 
                              <span className="measure">Load: {exerciseLink.externalLoadPrimary}kg</span>}
                            {exerciseLink.distance && 
                              <span className="measure">Distance: {exerciseLink.distance}m</span>}
                            {exerciseLink.time && 
                              <span className="measure">Time: {exerciseLink.time}s</span>}
                            {exerciseLink.calories && 
                              <span className="measure">Calories: {exerciseLink.calories}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="no-components">No components added to this workout</p>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="modal">
          <p>Are you sure you want to delete this workout?</p>
          <div className="modal-actions">
            <button onClick={() => onDelete?.(workout.id)}>Yes, Delete</button>
            <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {snackbar.show && (
        <Snackbar 
          message={snackbar.message}
          type="success"
          visible={snackbar.show}
        />
      )}
    </div>
  );
} 