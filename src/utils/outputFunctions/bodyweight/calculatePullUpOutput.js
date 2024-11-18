import { calculateWorkAndPower } from "../../calculateWorkAndPower";

export const calculatePullUpOutput = (athlete, measures) => {
    const bodyweight = athlete.weight; // Athlete's weight in kg
    const reps = measures.reps || 0; // Reps completed
    const time = measures.time || null; // Optional time for power calculation
  
    // General function: use default pull-up height
    const defaultDistance = 0.6; // Approximate meters per rep (average pull-up height)
    let distance = defaultDistance;
  
    // Complex function: override distance if limb length is available
    if (athlete.limbLength) {
      distance = athlete.limbLength / 2; // Approximate pull-up height as half of limb length
    }
  
    return calculateWorkAndPower(bodyweight, distance, reps, time);
  };
  