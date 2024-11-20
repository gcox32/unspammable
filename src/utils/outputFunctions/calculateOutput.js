import { calculateWorkAndPower } from "./calculateWorkAndPower";

export const calculateOutput = (athlete, measures, constants = {}) => {
  // Validate required inputs
  if (!athlete?.weight) {
    throw new Error('Athlete weight is required');
  }

  // Destructure constants with defaults
  const {
    useCalories = false,
    defaultDistance = 0.5,
    useLimbLength = false,
    limbLengthFactor = 1,
    bodyweightFactor = 0,
  } = constants;

  // If using calories (for cardio machines)
  if (useCalories && measures.calories) {
    const work = measures.calories * 4184; // 1 calorie = ~4184 Joules
    const workInKJ = work / 1000; // Convert to kJ
    if (measures.time) {
      const power = workInKJ / measures.time; // kW
      return { work: workInKJ, power, calories: measures.calories, distance: measures.distance };
    }
    return { work: workInKJ, calories: measures.calories, distance: measures.distance };
  }

  // Simplified weight calculation - always consider bodyweight with factor
  const weight = (athlete.weight * bodyweightFactor) + (measures.weight || 0);

  // Calculate distance to use
  let distance = defaultDistance;
  if (useLimbLength) {
    const limbLength = athlete.limbLength || athlete.legLength;
    if (limbLength) {
      distance = limbLength * limbLengthFactor;
    }
  }

  // For continuous movement (like running), use distance directly if provided
  if (measures.distance) {
    distance = measures.distance;
  }

  // Ensure we have reps (default to 1 for continuous movements)
  const reps = measures.reps || 1;

  // Use the existing work/power calculation function
  return calculateWorkAndPower(weight, distance, reps, measures.time);
};