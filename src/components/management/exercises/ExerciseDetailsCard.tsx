import { useState } from 'react';
import { ExerciseMeasures, UnitPreferences, ExerciseDefinition } from '@/src/types/exercise';

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
  EXERCISE_CATEGORIES: Record<string, ExerciseDefinition[]>;
  onCategoryChange: (value: string) => void;
  exerciseOptions?: ExerciseDefinition[];
  isAuthenticated?: boolean;
}

const allAvailableMeasures = ['externalLoad', 'reps', 'distance', 'time', 'calories'];

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
  exerciseOptions,
  isAuthenticated,
}: ExerciseDetailsCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const selectedExerciseDefinition = selectedCategory && selectedExercise
    ? isAuthenticated
      ? {
          name: selectedExercise,
          availableMeasures: allAvailableMeasures
        }
      : EXERCISE_CATEGORIES[selectedCategory].find(ex => ex.name === selectedExercise)
    : null;

  return (
    <div className="exercise-card">
      <div className="exercise-card-header">
        <div className="exercise-summary">
          <div className="exercise-title">
            <span className="exercise-number-label">Exercise {exerciseIndex + 1}</span>
            {selectedExercise && (
              <h3 className="exercise-name">
                {measures.reps && `${measures.reps} rep `}
                {measures.distance && `${measures.distance}${unitPreferences.distance === 'metric' ? 'm' : 'ft'} `}
                {measures.calories && `${measures.calories} calorie `}
                {selectedExercise}
                {measures.externalLoad ? ` at ${measures.externalLoad} ${unitPreferences.externalLoad === 'metric' ? 'kg' : 'lbs'}` : ''}
              </h3>
            )}
          </div>
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

      <div className={`exercise-details ${!isCollapsed ? 'expanded' : ''}`}>
        <div className="input-group">
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              const measureKeys: (keyof ExerciseMeasures)[] = ['reps', 'distance', 'externalLoad', 'calories', 'time'];
              measureKeys.forEach(measure => {
                onMeasureChange(measure, '');
              });
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
            onChange={(e) => {
              const measureKeys: (keyof ExerciseMeasures)[] = ['reps', 'distance', 'externalLoad', 'calories', 'time'];
              measureKeys.forEach(measure => {
                onMeasureChange(measure, '');
              });
              onExerciseChange(e.target.value);
            }}
            disabled={!selectedCategory}
          >
            <option value="">Select Exercise</option>
            {selectedCategory && (isAuthenticated && exerciseOptions ? 
              exerciseOptions.map(exercise => (
                <option key={exercise.name} value={exercise.name}>{exercise.name}</option>
              )) :
              EXERCISE_CATEGORIES[selectedCategory]?.map(exercise => (
                <option key={exercise.name} value={exercise.name}>{exercise.name}</option>
              ))
            )}
          </select>
        </div>

        <div className="measures-inputs">
          {selectedExerciseDefinition?.availableMeasures.map((measureName: any) => {
            switch (measureName) {
              case 'externalLoad':
                return (
                  <div className="input-group" key={measureName}>
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
                );
              case 'reps':
                return (
                  <div className="input-group" key={measureName}>
                    <label>Reps:</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={measures.reps || ''}
                      onChange={(e) => onMeasureChange('reps', e.target.value)}
                    />
                  </div>
                );
              case 'distance':
                return (
                  <div className="input-group" key={measureName}>
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
                );
              case 'calories':
                return (
                  <div className="input-group" key={measureName}>
                    <label>Calories:</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={measures.calories || ''}
                      onChange={(e) => onMeasureChange('calories', e.target.value)}
                    />
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );
} 