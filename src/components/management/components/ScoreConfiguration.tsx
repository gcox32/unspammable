import { useState } from 'react';

interface ScoreMeasure {
  type: string;
  unit: string;
  label: string;
}

interface ScoreConfigurationProps {
  onScoreChange: (measures: ScoreMeasure[]) => void;
}

export default function ScoreConfiguration({ onScoreChange }: ScoreConfigurationProps) {
  const [measures, setMeasures] = useState<ScoreMeasure[]>([]);

  const addMeasure = () => {
    const newMeasure: ScoreMeasure = {
      type: '',
      unit: '',
      label: ''
    };
    setMeasures([...measures, newMeasure]);
    onScoreChange([...measures, newMeasure]);
  };

  const updateMeasure = (index: number, field: keyof ScoreMeasure, value: string) => {
    const updatedMeasures = measures.map((measure, i) => {
      if (i === index) {
        return { ...measure, [field]: value };
      }
      return measure;
    });
    setMeasures(updatedMeasures);
    onScoreChange(updatedMeasures);
  };

  const removeMeasure = (index: number) => {
    const updatedMeasures = measures.filter((_, i) => i !== index);
    setMeasures(updatedMeasures);
    onScoreChange(updatedMeasures);
  };

  return (
    <div className="section-fields">
      {measures.map((measure, index) => (
        <div key={index} className="measure-row">
          <input
            type="text"
            value={measure.label}
            onChange={(e) => updateMeasure(index, 'label', e.target.value)}
            placeholder="Label (e.g., Total Time)"
            className="measure-input"
          />
          <select
            value={measure.type}
            onChange={(e) => updateMeasure(index, 'type', e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="time">Time</option>
            <option value="reps">Repetitions</option>
            <option value="rounds">Rounds</option>
            <option value="weight">Weight</option>
            <option value="distance">Distance</option>
            <option value="calories">Calories</option>
          </select>
          <select
            value={measure.unit}
            onChange={(e) => updateMeasure(index, 'unit', e.target.value)}
          >
            <option value="">Select Unit</option>
            <option value="seconds">Seconds</option>
            <option value="minutes">Minutes</option>
            <option value="count">Count</option>
            <option value="kg">Kilograms</option>
            <option value="meters">Meters</option>
            <option value="calories">Calories</option>
          </select>
          <button 
            type="button" 
            onClick={() => removeMeasure(index)}
            className="remove-measure"
          >
            Remove
          </button>
        </div>
      ))}
      <button 
        type="button" 
        onClick={addMeasure}
        className="add-button"
      >
        Add Measure
      </button>
    </div>
  );
} 