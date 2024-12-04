import { useState } from 'react';
import { ExerciseTemplate } from '@/src/types/schema';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import CreateItemForm from '../CreateItemForm';
import { EXERCISE_FIELDS } from '@/src/types/exercise';
import Snackbar from '../../Snackbar';
import { Spinner } from '../../Spinner';

interface ExerciseDetailsProps {
  exercise: ExerciseTemplate;
  onUpdate?: (updatedExercise: ExerciseTemplate) => void;
  onDelete?: (exerciseId: string) => void;
}

const client = generateClient<Schema>();

export default function ExerciseDetails({ exercise, onUpdate, onDelete }: ExerciseDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  const handleUpdate = async (formData: Record<string, any>) => {
    setIsUpdating(true);
    try {
      const { outputConstants, ...exerciseData } = formData;
      
      // Transform the calculation method selection into boolean
      if (outputConstants) {
        outputConstants.useCalories = outputConstants.useCalories === 'calories';
      }

      // Transform unilateral selection into boolean
      exerciseData.unilateral = exerciseData.unilateral === 'unilateral';

      // Update the exercise template
      const { data: updatedExercise } = await client.models.ExerciseTemplate.update({
        id: exercise.id,
        ...exerciseData
      });

      // Update or create the associated output constants
      if (outputConstants) {
        if (exercise.outputConstants?.id) {
          await client.models.ExerciseOutputConstants.update({
            id: exercise.outputConstants.id,
            ...outputConstants,
            exerciseTemplateId: exercise.id
          });
        } else {
          await client.models.ExerciseOutputConstants.create({
            ...outputConstants,
            exerciseTemplateId: exercise.id
          });
        }
      }

      // Notify parent component of update and wait for the refresh
      if (onUpdate) {
        // @ts-ignore
        await onUpdate(updatedExercise);
      }

      setIsEditing(false);
      setShowSuccessSnackbar(true);
      
      setTimeout(() => {
        setShowSuccessSnackbar(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating exercise:', error);
      throw new Error('Failed to update exercise');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (onDelete) {
        await onDelete(exercise.id);
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error('Error deleting exercise:', error);
      // You might want to show an error message to the user here
    }
  };

  if (isEditing) {
    return (
      <div className="exercise-edit-form">
        <div className="edit-header">
          <h4>Edit Exercise</h4>
          <button 
            className="cancel-button"
            onClick={() => setIsEditing(false)}
            disabled={isUpdating}
          >
            Cancel
          </button>
        </div>
        <CreateItemForm
          // @ts-ignore
          fields={EXERCISE_FIELDS}
          onSubmit={handleUpdate}
          title="Update Exercise"
          // @ts-ignore
          initialData={exercise}
          // @ts-ignore
          submitButtonText={isUpdating ? <Spinner /> : "Update Exercise"}
          disabled={isUpdating}
        />
      </div>
    );
  }

  return (
    <div className="list-exercise-details">
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

      {/* Add delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="modal-content">
            <h4>Delete Exercise</h4>
            <p>Are you sure you want to delete "{exercise.name}"? This action cannot be undone.</p>
            <div className="modal-buttons">
              <button 
                className="cancel-button"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="delete-button"
                onClick={() => {
                  handleDelete();
                  setShowDeleteConfirm(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing display code */}
      {exercise.videoEmbed ? (
        <div className="video-section">
          <div className="video-embed" 
            dangerouslySetInnerHTML={{ __html: exercise.videoEmbed }} 
          />
        </div>
      ) : exercise.videoUrl && (
        <div className="video-section">
          <a href={exercise.videoUrl} 
             target="_blank" 
             rel="noopener noreferrer" 
             className="video-link">
            Watch Demo Video
          </a>
        </div>
      )}

      {exercise.description && (
        <p className="exercise-description">{exercise.description}</p>
      )}

      {/* Output Configuration */}
      <div className="output-config">
        <h4>Output Constants Configuration</h4>
        <div className="output-grid">
          <div className="config-item">
            <span className="config-label">Bodyweight Factor</span>
            <span className="config-value">
              {exercise.outputConstants?.bodyweightFactor ?? 'Not set'}
            </span>
          </div>
          <div className="config-item">
            <span className="config-label">Default Distance</span>
            <span className="config-value">
              {exercise.outputConstants?.defaultDistance 
                ? `${exercise.outputConstants.defaultDistance}m` 
                : 'Not set'}
            </span>
          </div>
          <div className="config-item">
            <span className="config-label">Height Factor</span>
            <span className="config-value">
              {exercise.outputConstants?.heightFactor ?? 'Not set'}
            </span>
          </div>
          <div className="config-item">
            <span className="config-label">Arm Length Factor</span>
            <span className="config-value">
              {exercise.outputConstants?.armLengthFactor ?? 'Not set'}
            </span>
          </div>
          <div className="config-item">
            <span className="config-label">Leg Length Factor</span>
            <span className="config-value">
              {exercise.outputConstants?.legLengthFactor ?? 'Not set'}
            </span>
          </div>
          <div className="config-item">
            <span className="config-label">Calculation Method</span>
            <span className="config-value">
              {exercise.outputConstants?.useCalories === true
                ? 'Calories'
                : 'Force × Distance'}
            </span>
          </div>
        </div>
      </div>

      {/* Classification Section */}
      <div className="classification-section">
        <div className="classification-group">
          <h5 className="subheader">Category</h5>
          <div className="tags-section">
            {exercise.category ? (
              <span className="tag category-tag">{exercise.category}</span>
            ) : (
              <span className="no-data">No category specified</span>
            )}
          </div>
        </div>

        <div className="classification-group">
          <h5 className="subheader">Movement Patterns</h5>
          <div className="tags-section">
            {exercise.patternPrimary && (
              <span className="tag pattern-tag primary">Primary: {exercise.patternPrimary}</span>
            )}
            {exercise.patternSecondary && (
              <span className="tag pattern-tag secondary">Secondary: {exercise.patternSecondary}</span>
            )}
          </div>
        </div>

        <div className="classification-group">
          <h5 className="subheader">Movement Characteristics</h5>
          <div className="tags-section">
            {exercise.unilateral && (
              <span className="tag characteristic-tag">Unilateral</span>
            )}
            {exercise.plane && (
              <span className="tag plane-tag">{exercise.plane} Plane</span>
            )}
          </div>
        </div>

        <div className="classification-group">
          <h5 className="subheader">Equipment</h5>
          <div className="tags-section">
            {exercise.equipment && exercise.equipment.length > 0 ? (
              exercise.equipment.map((item, index) => (
                <span key={index} className="tag equipment-tag">{item}</span>
              ))
            ) : (
              <span className="no-data">No equipment required</span>
            )}
          </div>
        </div>
      </div>

      {showSuccessSnackbar && (
        <Snackbar 
          message="Exercise updated successfully"
          type="success"
          visible={showSuccessSnackbar}
        />
      )}
    </div>
  );
} 