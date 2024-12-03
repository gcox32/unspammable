import { useState } from 'react';
import { WorkoutComponentTemplate } from '@/src/types/schema';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import CreateComponentForm from '@/src/components/management/components/CreateComponentForm';
import Snackbar from '@/src/components/Snackbar';

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
      const { exercises, scores, ...componentData } = formData;

      // Update the component template
      const { data: updatedComponent } = await client.models.WorkoutComponentTemplate.update({
        id: component.id,
        ...componentData,
        sequenceOrder: parseInt(componentData.sequenceOrder)
      });

      // Handle score updates
      if (scores && scores.length > 0) {
        // If there's an existing score template, update it and its measures
        if (component.scores && component.scores[0]) {
          const existingScore = component.scores[0];
          
          // Delete existing measures
          if (existingScore.measures) {
            await Promise.all(
              existingScore.measures.map(measure =>
                client.models.Measure.delete({ id: measure.id })
              )
            );
          }

          // Create new measures
          await Promise.all(
            scores.map(async (score: { type: string; unit: string; label: string }) => {
              await client.models.Measure.create({
                workoutComponentTemplateScoreId: existingScore.id,
                type: score.type,
                unit: score.unit,
                label: score.label
              });
            })
          );
        } else {
          // Create new score template and measures
          const { data: scoreTemplate } = await client.models.WorkoutComponentTemplateScore.create({
            workoutComponentTemplateId: component.id
          });

          await Promise.all(
            scores.map(async (score: { type: string; unit: string; label: string }) => {
              await client.models.Measure.create({
                // @ts-ignore
                workoutComponentTemplateScoreId: scoreTemplate.id,
                type: score.type,
                unit: score.unit,
                label: score.label
              });
            })
          );
        }
      }

      // Fetch updated component with all relations
      const [exerciseLinks, scoreData] = await Promise.all([
        client.models.WorkoutComponentTemplateExercise.list({
          filter: { workoutComponentTemplateId: { eq: component.id } }
        }),
        client.models.WorkoutComponentTemplateScore.list({
          filter: { workoutComponentTemplateId: { eq: component.id } }
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

      // Notify parent component of update with complete data
      if (onUpdate) {
        await onUpdate({
          // @ts-ignore
          ...updatedComponent, exercises: exercisesWithDetails, scores: scoresWithMeasures
        });
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
          <h4>Edit Component</h4>
          <button 
            className="cancel-button"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>
        <CreateComponentForm
          onSubmit={handleUpdate}
          initialData={component}
        />
      </div>
    );
  }

  return (
    <div className="component-details">
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

      {component.description && (
        <p className="component-description">{component.description}</p>
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

      <div className="scoring-section">
        <h4>Scoring Configuration</h4>
        {component.scores && component.scores.length > 0 ? (
          <div className="scores-list">
            {component.scores.map((score) => (
              <div key={score.id} className="score-item">
                <h5>Scoring Measures</h5>
                <div className="measures-grid">
                  {score.measures?.map((measure) => (
                    measure && (
                      <div key={measure.id} className="measure-item">
                        <span className="measure-type">{measure.type}</span>
                        <span className="measure-unit">({measure.unit})</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-scores">No scoring configuration added</p>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="modal">
          <p>Are you sure you want to delete this component?</p>
          <div className="modal-actions">
            <button onClick={handleDelete}>Yes, Delete</button>
            <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
          </div>
        </div>
      )}

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