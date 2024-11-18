import { calculateWorkAndPower } from "../../calculateWorkAndPower";

export const calculateRowOutput = (athlete, measures) => {
  const calories = measures.calories || null; // Machine-reported calories
  const distance = measures.distance || null; // Simulated distance in meters (optional)
  const time = measures.time || null; // Time in seconds

  if (calories) {
    // Use calories as a direct proxy for work
    const work = calories * 4184; // 1 calorie = ~4184 Joules
    if (time) {
      const power = work / time;
      return { work, power, calories, distance };
    }
    return { work, calories, distance };
  }

  // Fallback: Use bodyweight and distance if calories are not available
  const bodyweight = athlete.weight;
  if (distance) {
    return calculateWorkAndPower(bodyweight, distance, 1, time); // Reps = 1 for continuous movement
  }

  throw new Error("Insufficient data: calories or distance required for Row output.");
};
