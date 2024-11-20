import { useState } from 'react';
import { ExerciseMeasures, UnitPreferences } from '@/src/types/exercise';

interface ExerciseDetailsCardProps {
  exerciseIndex: number;
  selectedCategory: string;
  selectedExercise: string;
  measures: ExerciseMeasures;
  unitPreferences: UnitPreferences;
  onExerciseChange: (value: string) => void;
  onMeasureChange: (field: keyof ExerciseMeasures, value: string) => void;
  onUnitToggle: (field: keyof UnitPreferences) => void;
  onRemove: () => void;
  EXERCISE_CATEGORIES: Record<string, string[]>;
  onCategoryChange: (value: string) => void;
}

export default function ExerciseDetailsCard({
  exerciseIndex,
  selectedCategory,
  selectedExercise,
  measures,
  unitPreferences,
  onExerciseChange,
  onMeasureChange,
  onUnitToggle,
  onRemove,
  EXERCISE_CATEGORIES,
  onCategoryChange,
}: ExerciseDetailsCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="exercise-card">
      <div className="exercise-card-header">
        <div className="exercise-summary">
          <span className="exercise-number">Exercise {exerciseIndex + 1}</span>
          {selectedExercise && (
            <span className="exercise-name">{selectedExercise}</span>
          )}
        </div>
        <div className="exercise-controls">
          <button
            className="collapse-button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? '▼' : '▲'}
          </button>
          <button
            className="remove-button"
            onClick={onRemove}
            aria-label="Remove exercise"
          >
            ✕
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="exercise-details">
          <div className="input-group">
            <label>Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                onExerciseChange(''); // Reset exercise when category changes
                onCategoryChange(e.target.value);
              }}
            >
              <option value="">Select Category</option>
              {Object.keys(EXERCISE_CATEGORIES).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Exercise:</label>
            <select
              value={selectedExercise}
              onChange={(e) => onExerciseChange(e.target.value)}
              disabled={!selectedCategory}
            >
              <option value="">Select Exercise</option>
              {selectedCategory && EXERCISE_CATEGORIES[selectedCategory]?.map(exercise => (
                <option key={exercise} value={exercise}>{exercise}</option>
              ))}
            </select>
          </div>

          <div className="measures-inputs">
            {/* Only show external load for non-cardio exercises */}
            {selectedExercise && !["Bike", "Row"].includes(selectedExercise) && (
              <div className="input-group">
                <label>External Load ({unitPreferences.externalLoad === 'metric' ? 'kg' : 'lbs'}):</label>
                <div className="input-with-toggle">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={measures.externalLoad || ''}
                    onChange={(e) => onMeasureChange('externalLoad', e.target.value)}
                  />
                  <button 
                    className="unit-toggle"
                    onClick={() => onUnitToggle('externalLoad')}
                  >
                    {unitPreferences.externalLoad === 'metric' ? 'kg' : 'lbs'}
                  </button>
                </div>
              </div>
            )}

            {/* Show calories input for Bike and Row */}
            {selectedExercise && ["Bike", "Row"].includes(selectedExercise) && (
              <div className="input-group">
                <label>Calories:</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={measures.calories || ''}
                  onChange={(e) => onMeasureChange('calories', e.target.value)}
                />
              </div>
            )}

            {/* Standard inputs */}
            <div className="input-group">
              <label>Reps:</label>
              <input
                type="number"
                min="0"
                step="1"
                value={measures.reps || ''}
                onChange={(e) => onMeasureChange('reps', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Distance ({unitPreferences.distance === 'metric' ? 'm' : 'ft'}):</label>
              <div className="input-with-toggle">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={measures.distance || ''}
                  onChange={(e) => onMeasureChange('distance', e.target.value)}
                />
                <button 
                  className="unit-toggle"
                  onClick={() => onUnitToggle('distance')}
                >
                  {unitPreferences.distance === 'metric' ? 'm' : 'ft'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 