import { calculateWorkAndPower } from "../calculateWorkAndPower";

export const calculateShoulderPressOutput = (athlete, measures) => {
    const weight = measures.weight || 0; // Barbell or dumbbell weight in kg
    const reps = measures.reps || 0; // Reps completed
    const time = measures.time || null; // Optional time for power calculation
  
    // General function: use default press height
    const defaultDistance = 0.4; // Meters per rep (average press height)
    let distance = defaultDistance;
  
    // Complex function: override distance if arm length is available
    if (athlete.limbLength) {
      distance = athlete.limbLength / 2.5; // Approximate press height as one-quarter of limb length
    }
  
    return calculateWorkAndPower(weight, distance, reps, time);
  };
  