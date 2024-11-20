import { calculateWorkAndPower } from "../calculateWorkAndPower";

export const calculateDeadliftOutput = (athlete, measures) => {
    const weight = measures.weight || 0; // Barbell weight in kg
    const reps = measures.reps || 0; // Reps completed
    const time = measures.time || null; // Optional time for power calculation
  
    // General function: use default pull distance
    const defaultDistance = 0.5; // Meters per rep (average pull distance for deadlift)
    let distance = defaultDistance;
  
    // Complex function: override distance if leg length is available
    if (athlete.legLength) {
      distance = athlete.legLength / 2; // Approximate pull distance as half of leg length
    }
  
    return calculateWorkAndPower(weight, distance, reps, time);
  };
  