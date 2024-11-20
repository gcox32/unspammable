"use client";

import { useState, useRef } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "@/src/styles/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { convertToMetric } from "@/src/utils/convertToMetric";

// Exercise categories and their corresponding functions
const EXERCISE_CATEGORIES = {
  bodyweight: ["Push-Up", "Pull-Up"],
  strength: ["Back Squat", "Deadlift", "Shoulder Press"],
  cardio: ["Run", "Bike", "Row"]
};

const EXERCISE_OUTPUT_FUNCTIONS = {
  "Push-Up": "calculatePushUpOutput",
  "Pull-Up": "calculatePullUpOutput",
  "Back Squat": "calculateBackSquatOutput",
  "Deadlift": "calculateDeadliftOutput",
  "Shoulder Press": "calculateShoulderPressOutput",
  "Run": "calculateRunOutput",
  "Bike": "calculateBikeOutput",
  "Row": "calculateRowOutput"
};

interface ExerciseMeasures {
  weight?: number;
  reps?: number;
  distance?: number;
  time?: number;
  calories?: number;
}

interface AthleteMetrics {
  weight: number;
  height?: number;
  limbLength?: number;
  legLength?: number;
}

interface UnitPreferences {
  weight: 'metric' | 'imperial';
  height: 'metric' | 'imperial';
  distance: 'metric' | 'imperial';
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [measures, setMeasures] = useState<ExerciseMeasures>({});
  const [athleteMetrics, setAthleteMetrics] = useState<AthleteMetrics>({
    weight: 0
  });
  const [outputScore, setOutputScore] = useState<any>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const [unitPreferences, setUnitPreferences] = useState<UnitPreferences>({
    weight: 'metric',
    height: 'metric',
    distance: 'metric'
  });

  const handleCalculate = async () => {
    try {
      const outputFunctionName = EXERCISE_OUTPUT_FUNCTIONS[selectedExercise as keyof typeof EXERCISE_OUTPUT_FUNCTIONS];
      
      const response = await fetch('/api/calculate-output', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: selectedCategory,
          outputFunctionName,
          measures,
          athleteMetrics
        }),
      });
      
      const result = await response.json();
      
      // First scroll to the output section
      outputRef.current?.scrollIntoView({ behavior: 'smooth' });
      
      // Wait for scroll to complete (approximately 500ms)
      setTimeout(() => {
        // Initialize counting animation
        let startWork = 0;
        let startPower = 0;
        const duration = 1000; // 1 second animation
        const steps = 60; // 60 steps for smooth animation
        const stepDuration = duration / steps;
        
        const workIncrement = result.work / steps;
        const powerIncrement = result.power ? result.power / steps : 0;
        
        const counter = setInterval(() => {
          startWork += workIncrement;
          startPower += powerIncrement;
          
          setOutputScore({
            work: Math.min(startWork, result.work),
            power: result.power ? Math.min(startPower, result.power) : undefined
          });
          
          if (startWork >= result.work) {
            clearInterval(counter);
            setOutputScore(result); // Ensure final values are exact
          }
        }, stepDuration);
      }, 500);
      
    } catch (error) {
      console.error('Error calculating output:', error);
    }
  };

  // Updated input handlers with validation
  const handleMeasureChange = (field: keyof ExerciseMeasures, value: string) => {
    const numValue = parseFloat(value);
    if (value === '' || isNaN(numValue)) {
      setMeasures({ ...measures, [field]: undefined });
    } else {
      let convertedValue = Math.max(0, numValue);
      
      // Convert to metric if needed
      if (field === 'weight' && unitPreferences.weight === 'imperial') {
        convertedValue = convertToMetric(convertedValue, 'lbs');
      }
      
      setMeasures({ ...measures, [field]: convertedValue });
    }
  };

  const handleAthleteMetricChange = (field: keyof AthleteMetrics, value: string) => {
    const numValue = parseFloat(value);
    if (value === '' || isNaN(numValue)) {
      setAthleteMetrics({ ...athleteMetrics, [field]: undefined });
    } else {
      let convertedValue = Math.max(0, numValue);
      
      // Convert to metric if needed
      if (field === 'weight' && unitPreferences.weight === 'imperial') {
        convertedValue = convertToMetric(convertedValue, 'lbs');
      } else if ((field === 'height' || field === 'limbLength' || field === 'legLength') 
          && unitPreferences.height === 'imperial') {
        convertedValue = convertToMetric(convertedValue, 'in');
      }
      
      setAthleteMetrics({ ...athleteMetrics, [field]: convertedValue });
    }
  };

  // Helper function to display values in selected unit
  const displayValue = (value: number | undefined, type: 'weight' | 'height' | 'distance'): string => {
    if (value === undefined) return '';
    
    if (unitPreferences[type] === 'imperial') {
      switch (type) {
        case 'weight':
          return (value * 2.20462).toFixed(1); // kg to lbs
        case 'height':
        case 'distance':
          return (value * 0.393701).toFixed(1); // cm to inches
      }
    }
    return value.toFixed(1);
  };

  return (
    <main className="calculator-page">
      <h1>Output Score Calculator</h1>
      
      <div className="calculator-container">
        <div className="exercise-section">
          <h2>Exercise Details</h2>
          
          <div className="input-group">
            <label>Category:</label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {Object.keys(EXERCISE_CATEGORIES).map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Exercise:</label>
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              disabled={!selectedCategory}
            >
              <option value="">Select Exercise</option>
              {selectedCategory && EXERCISE_CATEGORIES[selectedCategory as keyof typeof EXERCISE_CATEGORIES].map(exercise => (
                <option key={exercise} value={exercise}>{exercise}</option>
              ))}
            </select>
          </div>

          <div className="measures-inputs">
            <h3>Exercise Measures</h3>
            <div className="input-group">
              <label>External Load ({unitPreferences.weight === 'metric' ? 'kg' : 'lbs'}):</label>
              <div className="input-with-toggle">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={measures.weight || ''}
                  onChange={(e) => handleMeasureChange('weight', e.target.value)}
                />
                <button 
                  className="unit-toggle"
                  onClick={() => setUnitPreferences({
                    ...unitPreferences,
                    weight: unitPreferences.weight === 'metric' ? 'imperial' : 'metric'
                  })}
                >
                  {unitPreferences.weight === 'metric' ? 'kg' : 'lbs'}
                </button>
              </div>
            </div>
            <div className="input-group">
              <label>Reps:</label>
              <input
                type="number"
                min="0"
                step="1"
                value={measures.reps || ''}
                onChange={(e) => handleMeasureChange('reps', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Time (seconds):</label>
              <input
                type="number"
                min="0"
                step="1"
                value={measures.time || ''}
                onChange={(e) => handleMeasureChange('time', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="athlete-section">
          <h2>Athlete Metrics</h2>
          
          <div className="input-group">
            <label>Body Weight ({unitPreferences.weight === 'metric' ? 'kg' : 'lbs'}):</label>
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
                onClick={() => setUnitPreferences({
                  ...unitPreferences,
                  weight: unitPreferences.weight === 'metric' ? 'imperial' : 'metric'
                })}
              >
                {unitPreferences.weight === 'metric' ? 'kg' : 'lbs'}
              </button>
            </div>
          </div>
          
          <div className="input-group">
            <label>Height ({unitPreferences.height === 'metric' ? 'cm' : 'in'}):</label>
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
                onClick={() => setUnitPreferences({
                  ...unitPreferences,
                  height: unitPreferences.height === 'metric' ? 'imperial' : 'metric'
                })}
              >
                {unitPreferences.height === 'metric' ? 'cm' : 'in'}
              </button>
            </div>
          </div>
          
          <div className="input-group">
            <label>Limb Length (cm):</label>
            <input
              type="number"
              min="0"
              step="any"
              value={athleteMetrics.limbLength || ''}
              onChange={(e) => handleAthleteMetricChange('limbLength', e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <label>Leg Length (cm):</label>
            <input
              type="number"
              min="0"
              step="any"
              value={athleteMetrics.legLength || ''}
              onChange={(e) => handleAthleteMetricChange('legLength', e.target.value)}
            />
          </div>
        </div>
      </div>

      <button className="calculate-button" onClick={handleCalculate}>
        Calculate Output Score
      </button>

      {outputScore && (
        <div className="output-section" ref={outputRef}>
          <h2>Output Score</h2>
          <div className="score-display">
            <div className="score-item">
              <label>Work:</label>
              <span>{outputScore.work.toFixed(2)} kJ</span>
            </div>
            {outputScore.power && (
              <div className="score-item">
                <label>Average Power:</label>
                <span>{outputScore.power.toFixed(2)} kW</span>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
