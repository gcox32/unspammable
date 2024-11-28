import { useState } from 'react';
import { WorkoutComponentTemplate } from '@/src/types/schema';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import CreateItemForm from '../CreateItemForm';
import { COMPONENT_FIELDS } from '@/src/types/workout';
import Snackbar from '../../Snackbar';

interface ComponentDetailsProps {
  component: WorkoutComponentTemplate;
  onUpdate?: (updatedComponent: WorkoutComponentTemplate) => void;
  onDelete?: (componentId: string) => void;
}

const client = generateClient<Schema>();

export default function ComponentDetails({ component, onUpdate, onDelete }: ComponentDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  const handleUpdate = async (formData: Record<string, any>) => {
    try {
      // Update the component template
      const { data: updatedComponent } = await client.models.WorkoutComponentTemplate.update({
        id: component.id,
        ...formData,
        sequenceOrder: parseInt(formData.sequenceOrder)
      });

      // Notify parent component of update
      if (onUpdate) {
        // @ts-ignore
        await onUpdate(updatedComponent);
      }

      setIsEditing(false);
      setShowSuccessSnackbar(true);
      
      setTimeout(() => {
        setShowSuccessSnackbar(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating component:', error);
      throw new Error('Failed to update component');
    }
  };

  const handleDelete = async () => {
    try {
      if (onDelete) {
        await onDelete(component.id);
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error('Error deleting component:', error);
    }
  };

  if (isEditing) {
    return (
      <div className="component-edit-form">
        <div className="edit-header">
          <h3>Edit Component</h3>
          <button 
            className="cancel-button"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>
        <CreateItemForm
          // @ts-ignore
          fields={COMPONENT_FIELDS}
          onSubmit={handleUpdate}
          title="Update Component"
          initialData={component}
        />
      </div>
    );
  }

  return (
    <div className="list-component-details">
      <div className="details-header">
        <h4>Summary</h4>
        <div className="header-buttons">
          <button 
            className="edit-button"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
          <button 
            className="delete-button"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="modal-content">
            <h4>Delete Component</h4>
            <p>Are you sure you want to delete "{component.name}"? This action cannot be undone.</p>
            <div className="modal-buttons">
              <button 
                className="cancel-button"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="delete-button"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {component.name && (
        <p className="component-description">{component.name}</p>
      )}

      <div className="exercises-section">
        <h4>Exercises</h4>
        {component.exercises && component.exercises.length > 0 ? (
          <ul className="exercises-list">
            {component.exercises.map((exerciseLink) => (
              <li key={exerciseLink.id} className="exercise-item">
                <h5>{exerciseLink.exercise?.name}</h5>
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
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-exercises">No exercises added to this component</p>
        )}
      </div>

      {showSuccessSnackbar && (
        <Snackbar 
          message="Component updated successfully"
          type="success"
          visible={showSuccessSnackbar}
        />
      )}
    </div>
  );
} 