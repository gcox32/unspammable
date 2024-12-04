"use client";

import { useState, useRef, useEffect } from "react";
import "@/src/styles/app.css";
import "@aws-amplify/ui-react/styles.css";
import { convertUnits } from "@/src/utils/convertUnits";
import { EXERCISE_CONSTANTS } from "@/src/utils/outputFunctions/exerciseConstants";
import ExerciseDetailsCard from '@/src/components/management/exercises/ExerciseDetailsCard';
import {
  ExerciseMeasures,
  AthleteMetrics,
  UnitPreferences,
  EXERCISE_CATEGORIES,
  ExerciseDefinition
} from '@/src/types/exercise';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Athlete } from '@/src/types/schema';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

export default function CalculatorPage() {
  const { authStatus, user } = useAuthenticator((context) => [context.authStatus]);
  const isAuthenticated = authStatus === 'authenticated';
  const athleteId: string | undefined = user?.username;

  const [athleteMetrics, setAthleteMetrics] = useState<AthleteMetrics>({
    weight: 80,
    height: 180,
    armLength: 0,
    legLength: 0
  });
  const [outputScore, setOutputScore] = useState<any>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const [unitPreferences, setUnitPreferences] = useState<UnitPreferences>({
    weight: 'metric',
    height: 'metric',
    externalLoad: 'metric',
    distance: 'metric',
    armLength: 'metric',
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
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [exerciseOptions, setExerciseOptions] = useState<ExerciseDefinition[]>([]);

  const fetchAthlete = async (athleteId: string) => {
    const { data: athlete } = await client.models.Athlete.get({ id: athleteId });
    // @ts-ignore
    setAthlete(athlete);
  };

  const getMetricMeasures = (exercises: any[], unitPreferences: UnitPreferences) => {
    return exercises.map(exercise => ({
      ...exercise.measures,
      externalLoad: exercise.measures.externalLoad && unitPreferences.externalLoad === 'imperial'
        ? convertUnits(exercise.measures.externalLoad, 'lbs', 'kg')
        : exercise.measures.externalLoad,
      distance: exercise.measures.distance && unitPreferences.distance === 'imperial'
        ? convertUnits(exercise.measures.distance, 'ft', 'm')
        : exercise.measures.distance
    }));
  };

  const getMetricAthleteData = (metrics: AthleteMetrics, preferences: UnitPreferences) => {
    return {
      ...metrics,
      weight: preferences.weight === 'imperial'
        ? convertUnits(metrics.weight, 'lbs', 'kg')
        : metrics.weight,
      height: preferences.height === 'imperial'
        ? convertUnits(metrics.height, 'in', 'cm')
        : metrics.height,
      armLength: preferences.armLength === 'imperial'
        ? convertUnits(metrics.armLength, 'in', 'cm')
        : metrics.armLength,
      legLength: preferences.legLength === 'imperial'
        ? convertUnits(metrics.legLength, 'in', 'cm')
        : metrics.legLength
    };
  };

  const getExerciseConstants = async (exercises: any[]) => {
    if (isAuthenticated) {
      return await Promise.all(exercises.map(async (exercise) => {
        // Get the exercise template first
        const { data: exerciseTemplate } = await client.models.ExerciseTemplate.list({
          filter: {
            name: { eq: exercise.exercise }
          }
        });

        if (!exerciseTemplate?.[0]?.id) {
          return { defaultDistance: 0.5 };
        }

        // Get the associated output constants
        const { data: constantsData } = await client.models.ExerciseOutputConstants.list({
          filter: {
            exerciseTemplateId: { eq: exerciseTemplate[0].id }
          }
        });

        return constantsData?.[0] || { defaultDistance: 0.5 };
      }));
    }

    // Fall back to hardcoded constants for non-authenticated users
    return exercises.map(exercise =>
      EXERCISE_CONSTANTS[exercise.exercise as keyof typeof EXERCISE_CONSTANTS] || {
        defaultDistance: 0.5
      }
    );
  };

  const handleCalculate = async () => {
    try {
      setError(null);

      if (!athleteMetrics.weight) {
        throw new Error('Athlete weight is required');
      }

      const payload = {
        measuresArray: getMetricMeasures(exercises, unitPreferences),
        athleteMetrics: getMetricAthleteData(athleteMetrics, unitPreferences),
        time: totalTime,
        constantsArray: await getExerciseConstants(exercises)
      };
      console.log(payload);
      const response = await fetch('/api/calculate-output', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to calculate output');
      }

      const result = await response.json();
      handleOutputAnimation(result);

    } catch (error) {
      console.error('Error calculating output:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setOutputScore(null);
    }
  };

  const handleOutputAnimation = (result: any) => {
    const newOutputScore = {
      work: result.work,
      power: totalTime ? result.power : undefined
    };

    setOutputScore(newOutputScore);

    setTimeout(() => {
      outputRef.current?.scrollIntoView({ behavior: 'smooth' });

      setTimeout(() => {
        animateOutput(newOutputScore);
      }, 500);
    }, 100);
  };

  const animateOutput = (targetScore: any) => {
    let startWork = 0;
    let startPower = 0;
    const duration = 1000;
    const steps = 60;
    const stepDuration = duration / steps;
    const workIncrement = targetScore.work / steps;
    const powerIncrement = targetScore.power ? targetScore.power / steps : 0;

    const counter = setInterval(() => {
      startWork += workIncrement;
      startPower += powerIncrement;

      setOutputScore({
        work: Math.min(startWork, targetScore.work),
        power: targetScore.power ? Math.min(startPower, targetScore.power) : undefined
      });

      if (startWork >= targetScore.work) {
        clearInterval(counter);
        setOutputScore(targetScore);
      }
    }, stepDuration);
  };

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
    } else if (field === 'armLength' && athleteMetrics.armLength !== undefined) {
      const convertedArmLength = currentUnit === 'metric'
        ? convertUnits(athleteMetrics.armLength, 'cm', 'in')
        : convertUnits(athleteMetrics.armLength, 'in', 'cm');
      setAthleteMetrics(prev => ({ ...prev, armLength: convertedArmLength }));
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

  const handleCategoryChange = async(index: number, value: string) => {
    if (isAuthenticated) {
      const { data: fetchedExercises } = await client.models.ExerciseTemplate.list({
        filter: {
          category: { eq: value }
        }
      });

      const formattedExercises: ExerciseDefinition[] = fetchedExercises.map((exercise: any) => ({
        name: exercise.name,
        availableMeasures: ['reps', 'externalLoad', 'distance', 'calories'].filter(measure => 
          exercise[measure] !== undefined
        ) as (keyof ExerciseMeasures)[]
      }));

      setExerciseOptions(formattedExercises);
    }
    
    setExercises(exercises.map((exercise, i) => {
      if (i === index) {
        return {
          ...exercise,
          category: value,
          exercise: '',
          measures: {}
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

  useEffect(() => {
    if (athleteId) {
      fetchAthlete(athleteId);
    }
  }, [athleteId]);

  return (
    <div className="calculator-page content">
      <h2>Output Score Calculator</h2>
      <p>Enter the details of the exercise you performed and your athlete metrics to calculate your output score. To choose new exercises, you must have an account. Once you have an account, you can <a href="/management/exercises">add exercises to the workout library</a>. Any exercises you add to the workout library will be available to choose from here.</p>
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
              exerciseOptions={exerciseOptions}
              isAuthenticated={isAuthenticated}
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
            <label>Arm Length ({unitPreferences.armLength === 'metric' ? 'cm' : 'in'}):</label>
            <div className="input-with-toggle">
              <input
                type="number"
                min="0"
                step="any"
                value={athleteMetrics.armLength || ''}
                onChange={(e) => handleAthleteMetricChange('armLength', e.target.value)}
              />
              <button
                className="unit-toggle"
                onClick={() => handleUnitToggle('armLength')}
              >
                {unitPreferences.armLength === 'metric' ? 'cm' : 'in'}
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
          : 'Calculate Output'}
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
    </div>
  );
}
