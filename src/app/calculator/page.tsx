"use client";

import { useState, useRef } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "@/src/styles/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { convertUnits } from "@/src/utils/convertUnits";
import { EXERCISE_CONSTANTS } from "@/src/utils/outputFunctions/exerciseConstants";
import ExerciseDetailsCard from '@/src/components/ExerciseDetailsCard';
import { 
  ExerciseMeasures, 
  AthleteMetrics, 
  UnitPreferences,
  EXERCISE_CATEGORIES 
} from '@/src/types/exercise';

export default function CalculatorPage() {
  const [athleteMetrics, setAthleteMetrics] = useState<AthleteMetrics>({
    weight: 80,
    height: 180,
    limbLength: 0,
    legLength: 0
  });
  const [outputScore, setOutputScore] = useState<any>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const [unitPreferences, setUnitPreferences] = useState<UnitPreferences>({
    weight: 'metric',
    height: 'metric',
    externalLoad: 'metric',
    distance: 'metric',
    limbLength: 'metric',
    legLength: 'metric'
  });
  const [error, setError] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Array<{
    category: string;
    exercise: string;
    measures: ExerciseMeasures;
  }>>([{
    category: '',
    exercise: '',
    measures: {}
  }]);
  const [totalTime, setTotalTime] = useState<number | undefined>(undefined);

  const handleCalculate = async () => {
    try {
      setError(null);
      
      // Validate required inputs
      if (!athleteMetrics.weight) {
        throw new Error('Athlete weight is required');
      }

      // Convert measurements to metric
      const metricMeasures = exercises.map(exercise => ({
        ...exercise.measures,
        externalLoad: exercise.measures.externalLoad && unitPreferences.externalLoad === 'imperial' 
          ? convertUnits(exercise.measures.externalLoad, 'lbs', 'kg')
          : exercise.measures.externalLoad,
        distance: exercise.measures.distance && unitPreferences.distance === 'imperial'
          ? convertUnits(exercise.measures.distance, 'ft', 'm')
          : exercise.measures.distance
      }));

      const metricsInMeters = {
        ...athleteMetrics,
        weight: unitPreferences.weight === 'imperial' ? convertUnits(athleteMetrics.weight, 'lbs', 'kg') : athleteMetrics.weight,
        height: unitPreferences.height === 'imperial' ? convertUnits(athleteMetrics.height, 'in', 'cm') : athleteMetrics.height,
        limbLength: unitPreferences.limbLength === 'imperial' ? convertUnits(athleteMetrics.limbLength, 'in', 'cm') : athleteMetrics.limbLength,
        legLength: unitPreferences.legLength === 'imperial' ? convertUnits(athleteMetrics.legLength, 'in', 'cm') : athleteMetrics.legLength
      };

      const response = await fetch('/api/calculate-output', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          measuresArray: metricMeasures,
          athleteMetrics: metricsInMeters,
          time: totalTime,
          constantsArray: exercises.map(exercise => 
            EXERCISE_CONSTANTS[exercise.exercise as keyof typeof EXERCISE_CONSTANTS] || {
              defaultDistance: 0.5
            }
          )
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to calculate output');
      }
      
      const result = await response.json();
      const newOutputScore = {
        work: result.work,
        power: totalTime ? result.power : undefined
      };

      setOutputScore(newOutputScore);

      // Move animation code here, after setting the new value
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth' });
        
        setTimeout(() => {
          let startWork = 0;
          let startPower = 0;
          const duration = 1000;
          const steps = 60;
          const stepDuration = duration / steps;
          const workIncrement = newOutputScore.work / steps;
          const powerIncrement = newOutputScore.power ? newOutputScore.power / steps : 0;
          
          const counter = setInterval(() => {
            startWork += workIncrement;
            startPower += powerIncrement;
            
            setOutputScore({
              work: Math.min(startWork, newOutputScore.work),
              power: newOutputScore.power ? Math.min(startPower, newOutputScore.power) : undefined
            });
            
            if (startWork >= newOutputScore.work) {
              clearInterval(counter);
              setOutputScore(newOutputScore);
            }
          }, stepDuration);
        }, 500);
      }, 100);
      
    } catch (error) {
      console.error('Error calculating output:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setOutputScore(null);
    }
  }

  const handleAthleteMetricChange = (field: keyof AthleteMetrics, value: string) => {
    const numValue = parseFloat(value);
    if (value === '' || isNaN(numValue)) {
      setAthleteMetrics({ ...athleteMetrics, [field]: undefined });
    } else {
      const convertedValue = Math.max(0, numValue);
      setAthleteMetrics({ ...athleteMetrics, [field]: convertedValue });
    }
  };

  const handleUnitToggle = (field: keyof UnitPreferences) => {
    const currentUnit = unitPreferences[field];
    const newUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
    
    // Handle athlete metrics conversions
    if (field === 'weight' && athleteMetrics.weight !== undefined) {
      const convertedWeight = currentUnit === 'metric' 
        ? convertUnits(athleteMetrics.weight, 'kg', 'lbs')
        : convertUnits(athleteMetrics.weight, 'lbs', 'kg');
      setAthleteMetrics(prev => ({ ...prev, weight: convertedWeight }));
    } else if (field === 'height' && athleteMetrics.height !== undefined) {
      const convertedHeight = currentUnit === 'metric'
        ? convertUnits(athleteMetrics.height, 'cm', 'in')
        : convertUnits(athleteMetrics.height, 'in', 'cm');
      setAthleteMetrics(prev => ({ ...prev, height: convertedHeight }));
    } else if (field === 'limbLength' && athleteMetrics.limbLength !== undefined) {
      const convertedLimbLength = currentUnit === 'metric'
        ? convertUnits(athleteMetrics.limbLength, 'cm', 'in')
        : convertUnits(athleteMetrics.limbLength, 'in', 'cm');
      setAthleteMetrics(prev => ({ ...prev, limbLength: convertedLimbLength }));
    } else if (field === 'legLength' && athleteMetrics.legLength !== undefined) {
      const convertedLegLength = currentUnit === 'metric'
        ? convertUnits(athleteMetrics.legLength, 'cm', 'in')
        : convertUnits(athleteMetrics.legLength, 'in', 'cm');
      setAthleteMetrics(prev => ({ ...prev, legLength: convertedLegLength }));
    }
    
    // Handle exercise-specific conversions
    if (field === 'externalLoad' || field === 'distance') {
      setExercises(prevExercises => prevExercises.map(exercise => {
        const measures = { ...exercise.measures };
        
        if (field === 'externalLoad' && measures.externalLoad !== undefined) {
          measures.externalLoad = currentUnit === 'metric'
            ? convertUnits(measures.externalLoad, 'kg', 'lbs')
            : convertUnits(measures.externalLoad, 'lbs', 'kg');
        }
        
        if (field === 'distance' && measures.distance !== undefined) {
          measures.distance = currentUnit === 'metric'
            ? convertUnits(measures.distance, 'm', 'ft')
            : convertUnits(measures.distance, 'ft', 'm');
        }
        
        return {
          ...exercise,
          measures
        };
      }));
    }
    
    // Update the unit preference
    setUnitPreferences(prev => ({ ...prev, [field]: newUnit }));
  };

  const addExercise = () => {
    setExercises([...exercises, {
      category: '',
      exercise: '',
      measures: {}
    }]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (index: number, value: string) => {
    setExercises(exercises.map((exercise, i) => {
      if (i === index) {
        // Reset exercise and measures when category changes
        return {
          ...exercise,
          category: value,
          exercise: '', // Reset exercise selection
          measures: {} // Reset all measures
        };
      }
      return exercise;
    }));
  };

  const handleExerciseChange = (index: number, value: string) => {
    setExercises(exercises.map((exercise, i) => {
      if (i === index) {
        return {
          ...exercise,
          exercise: value,
          measures: {} // Reset measures when exercise changes
        };
      }
      return exercise;
    }));
  };

  const handleMeasureChange = (index: number, field: keyof ExerciseMeasures, value: string) => {
    setExercises(exercises.map((exercise, i) => {
      if (i === index) {
        return {
          ...exercise,
          measures: {
            ...exercise.measures,
            [field]: parseFloat(value) || undefined
          }
        };
      }
      return exercise;
    }));
  };

  return (
    <main className="calculator-page">
      <h1>Output Score Calculator</h1>
      
      <div className="calculator-container">
        <div className="exercise-section">
          <h2>Exercise Details</h2>
          
          {exercises.map((exercise, index) => (
            <ExerciseDetailsCard
              key={index}
              exerciseIndex={index}
              selectedCategory={exercise.category}
              selectedExercise={exercise.exercise}
              measures={exercise.measures}
              unitPreferences={unitPreferences}
              onCategoryChange={(value) => handleCategoryChange(index, value)}
              onExerciseChange={(value) => handleExerciseChange(index, value)}
              onMeasureChange={(field, value) => handleMeasureChange(index, field, value)}
              onUnitToggle={handleUnitToggle}
              onRemove={() => removeExercise(index)}
              EXERCISE_CATEGORIES={EXERCISE_CATEGORIES}
            />
          ))}

          <button 
            className="add-exercise-button"
            onClick={addExercise}
          >
            + Add Exercise
          </button>
        </div>

        <div className="athlete-section">
          <h2>Athlete Metrics</h2>
          
          <div className="input-group">
            <label>Body Weight* ({unitPreferences.weight === 'metric' ? 'kg' : 'lbs'}):</label>
            <div className="input-with-toggle">
              <input
                type="number"
                min="0"
                step="any"
                value={athleteMetrics.weight || ''}
                onChange={(e) => handleAthleteMetricChange('weight', e.target.value)}
              />
              <button 
                className="unit-toggle"
                onClick={() => handleUnitToggle('weight')}
              >
                {unitPreferences.weight === 'metric' ? 'kg' : 'lbs'}
              </button>
            </div>
          </div>
          
          <div className="input-group">
            <label>Height* ({unitPreferences.height === 'metric' ? 'cm' : 'in'}):</label>
            <div className="input-with-toggle">
              <input
                type="number"
                min="0"
                step="any"
                value={athleteMetrics.height || ''}
                onChange={(e) => handleAthleteMetricChange('height', e.target.value)}
              />
              <button 
                className="unit-toggle"
                onClick={() => handleUnitToggle('height')}
              >
                {unitPreferences.height === 'metric' ? 'cm' : 'in'}
              </button>
            </div>
          </div>
          
          <div className="input-group">
            <label>Arm Length ({unitPreferences.limbLength === 'metric' ? 'cm' : 'in'}):</label>
            <div className="input-with-toggle">
              <input
                type="number"
                min="0"
                step="any"
                value={athleteMetrics.limbLength || ''}
                onChange={(e) => handleAthleteMetricChange('limbLength', e.target.value)}
              />
              <button 
                className="unit-toggle"
                onClick={() => handleUnitToggle('limbLength')}
              >
                {unitPreferences.limbLength === 'metric' ? 'cm' : 'in'}
              </button>
            </div>
          </div>
          
          <div className="input-group">
            <label>Leg Length ({unitPreferences.legLength === 'metric' ? 'cm' : 'in'}):</label>
            <div className="input-with-toggle">
              <input
                type="number"
                min="0"
                step="any"
                value={athleteMetrics.legLength || ''}
                onChange={(e) => handleAthleteMetricChange('legLength', e.target.value)}
              />
              <button 
                className="unit-toggle"
                onClick={() => handleUnitToggle('legLength')}
              >
                {unitPreferences.legLength === 'metric' ? 'cm' : 'in'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="time-input-section">
        <div className="input-group">
          <label>Total Time (seconds):</label>
          <input
            type="number"
            min="0"
            step="1"
            value={totalTime || ''}
            onChange={(e) => setTotalTime(e.target.value ? parseFloat(e.target.value) : undefined)}
          />
        </div>
      </div>

      <button 
        className="calculate-button" 
        onClick={handleCalculate}
        disabled={!athleteMetrics.weight || !athleteMetrics.height}
      >
        {!athleteMetrics.weight || !athleteMetrics.height 
          ? 'Please enter required fields' 
          : 'Calculate Output Score'}
      </button>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {outputScore && (
        <div className="output-section" ref={outputRef}>
          <h2>Output Score</h2>
          <div className="score-display">
            <div className="score-item">
              <label>Work:</label>
              <span>{Math.round(outputScore.work).toLocaleString()} Joules</span>
            </div>
            {outputScore.power && (
              <div className="score-item">
                <label>Average Power:</label>
                <span>{Number(outputScore.power.toFixed(2)).toLocaleString()} Watts</span>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
