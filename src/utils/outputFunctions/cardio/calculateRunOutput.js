import { calculateWorkAndPower } from "../calculateWorkAndPower";

export const calculateRunOutput = (athlete, measures) => {
  const bodyweight = athlete.weight; // Athlete's weight in kg
  const distance = measures.distance || 0; // Distance run in meters
  const time = measures.time || null; // Optional time for power calculation

  // Use the reusable function to compute work and power
  return calculateWorkAndPower(bodyweight, distance, 1, time); // Reps = 1 for continuous movement
};
