import { useState } from 'react';
import { WorkoutTemplate } from '@/src/types/schema';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import CreateWorkoutForm from './CreateWorkoutForm';

interface WorkoutDetailsProps {
  workout: WorkoutTemplate;
  onUpdate?: (updatedWorkout: WorkoutTemplate) => void;
  onDelete?: (workoutId: string) => void;
}

const client = generateClient<Schema>();

export default function WorkoutDetails({ workout, onUpdate, onDelete }: WorkoutDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdate = async (formData: Record<string, any>) => {
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

      // Fetch component details
      const componentsWithDetails = await Promise.all(
        componentLinks.map(async (link) => {
          const { data: componentData } = await client.models.WorkoutComponentTemplate.get({ 
            id: link.workoutComponentTemplateId 
          });
          return componentData;
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

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating workout:', error);
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
          >
            Cancel
          </button>
        </div>
        <CreateWorkoutForm
          onSubmit={handleUpdate}
          initialData={workout}
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
            {workout.workoutComponentTemplates.map((component) => (
              <li key={component.id} className="component-item">
                <h5>{component.workoutComponentTemplate?.name}</h5>
                {component.workoutComponentTemplate?.description && (
                  <p className="component-description">{component.workoutComponentTemplate.description}</p>
                )}
              </li>
            ))}
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
    </div>
  );
} 