"use client";

import { useState, useRef } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "@/src/styles/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { convertToMetric } from "@/src/utils/convertToMetric";
import { convertToImperial } from "@/src/utils/convertToImperial";

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
  externalLoad?: number;
  reps?: number;
  distance?: number;
  time?: number;
  calories?: number;
}

interface AthleteMetrics {
  weight: number;
  height: number;
  limbLength?: number;
  legLength?: number;
}

interface UnitPreferences {
  weight: 'metric' | 'imperial';
  height: 'metric' | 'imperial';
  externalLoad: 'metric' | 'imperial';
  distance: 'metric' | 'imperial';
  limbLength: 'metric' | 'imperial';
  legLength: 'metric' | 'imperial';
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [measures, setMeasures] = useState<ExerciseMeasures>({});
  const [athleteMetrics, setAthleteMetrics] = useState<AthleteMetrics>({
    weight: 0,
    height: 0,
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

  const handleCalculate = async () => {
    try {
      const outputFunctionName = EXERCISE_OUTPUT_FUNCTIONS[selectedExercise as keyof typeof EXERCISE_OUTPUT_FUNCTIONS];
      
      // Convert all measurements to metric before sending
      const metricMeasures = {
        ...measures,
        externalLoad: measures.externalLoad && unitPreferences.externalLoad === 'imperial' 
          ? convertToMetric(measures.externalLoad, 'lbs') 
          : measures.externalLoad,
      };

      const metricAthleteMetrics = {
        ...athleteMetrics,
        weight: athleteMetrics.weight && unitPreferences.weight === 'imperial'
          ? convertToMetric(athleteMetrics.weight, 'lbs')
          : athleteMetrics.weight,
        height: athleteMetrics.height && unitPreferences.height === 'imperial'
          ? convertToMetric(athleteMetrics.height, 'in')
          : athleteMetrics.height,
        limbLength: athleteMetrics.limbLength && unitPreferences.limbLength === 'imperial'
          ? convertToMetric(athleteMetrics.limbLength, 'in')
          : athleteMetrics.limbLength,
        legLength: athleteMetrics.legLength && unitPreferences.legLength === 'imperial'
          ? convertToMetric(athleteMetrics.legLength, 'in')
          : athleteMetrics.legLength,
      };

      // Convert length measurements from cm to m before sending
      const metricsInMeters = {
        ...metricAthleteMetrics,
        height: metricAthleteMetrics.height ? metricAthleteMetrics.height / 100 : undefined,
        limbLength: metricAthleteMetrics.limbLength ? metricAthleteMetrics.limbLength / 100 : undefined,
        legLength: metricAthleteMetrics.legLength ? metricAthleteMetrics.legLength / 100 : undefined,
      };
      
      const response = await fetch('/api/calculate-output', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: selectedCategory,
          outputFunctionName,
          measures: metricMeasures,
          athleteMetrics: metricsInMeters
        }),
      });
      
      const result = await response.json();
      
      // Set the output score first
      setOutputScore(result);
      
      // Add a small delay before scrolling to ensure the output section is rendered
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth' });
        
        // Start the counting animation after scrolling
        setTimeout(() => {
          let startWork = 0;
          let startPower = 0;
          const duration = 1000;
          const steps = 60;
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
      }, 100);  // Small delay to ensure ref is available
      
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
      const convertedValue = Math.max(0, numValue);
      setMeasures({ ...measures, [field]: convertedValue });
    }
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
    
    // Convert the value if it exists
    if (field === 'weight' && athleteMetrics.weight !== undefined) {
      const convertedWeight = currentUnit === 'metric' 
        ? convertToImperial(athleteMetrics.weight, 'lbs')
        : convertToMetric(athleteMetrics.weight, 'lbs');
      setAthleteMetrics(prev => ({ ...prev, weight: convertedWeight }));
    } else if (field === 'height' && athleteMetrics.height !== undefined) {
      const convertedHeight = currentUnit === 'metric'
        ? convertToImperial(athleteMetrics.height, 'in')
        : convertToMetric(athleteMetrics.height, 'in');
      setAthleteMetrics(prev => ({ ...prev, height: convertedHeight }));
    } else if (field === 'limbLength' && athleteMetrics.limbLength !== undefined) {
      const convertedLimbLength = currentUnit === 'metric'
        ? convertToImperial(athleteMetrics.limbLength, 'in')
        : convertToMetric(athleteMetrics.limbLength, 'in');
      setAthleteMetrics(prev => ({ ...prev, limbLength: convertedLimbLength }));
    } else if (field === 'legLength' && athleteMetrics.legLength !== undefined) {
      const convertedLegLength = currentUnit === 'metric'
        ? convertToImperial(athleteMetrics.legLength, 'in')
        : convertToMetric(athleteMetrics.legLength, 'in');
      setAthleteMetrics(prev => ({ ...prev, legLength: convertedLegLength }));
    }
    
    // Update the unit preference
    setUnitPreferences(prev => ({ ...prev, [field]: newUnit }));
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
              <label>External Load ({unitPreferences.externalLoad === 'metric' ? 'kg' : 'lbs'}):</label>
              <div className="input-with-toggle">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={measures.externalLoad || ''}
                  onChange={(e) => handleMeasureChange('externalLoad', e.target.value)}
                />
                <button 
                  className="unit-toggle"
                  onClick={() => handleUnitToggle('externalLoad')}
                >
                  {unitPreferences.externalLoad === 'metric' ? 'kg' : 'lbs'}
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
              <label>Distance ({unitPreferences.distance === 'metric' ? 'm' : 'ft'}):</label>
              <div className="input-with-toggle">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={measures.distance || ''}
                  onChange={(e) => handleMeasureChange('distance', e.target.value)}
                />
                <button 
                  className="unit-toggle"
                  onClick={() => handleUnitToggle('distance')}
                >
                  {unitPreferences.distance === 'metric' ? 'm' : 'ft'}
                </button>
              </div>
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
            <label>Limb Length ({unitPreferences.limbLength === 'metric' ? 'cm' : 'in'}):</label>
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

      <button 
        className="calculate-button" 
        onClick={handleCalculate}
        disabled={!athleteMetrics.weight || !athleteMetrics.height}
      >
        {!athleteMetrics.weight || !athleteMetrics.height 
          ? 'Please enter required fields' 
          : 'Calculate Output Score'}
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
