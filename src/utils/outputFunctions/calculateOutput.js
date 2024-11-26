export const calculateOutput = (athlete, measuresArray, time = null, constantsArray = [], acceleration = 9.81) => {
  // Validate required inputs
  if (!athlete?.weight) {
    throw new Error('Athlete weight is required');
  }

  let totalWork = 0;

  // Process each measure with its corresponding constants
  measuresArray.forEach((measures, index) => {
    const constants = constantsArray[index] || {
      useCalories: false,
      defaultDistance: 0.5,
      useArmLength: false,
      armLengthFactor: 1,
      bodyweightFactor: 0,
    };

    // If using calories (for cardio machines)
    if (constants.useCalories) {
      if (measures.calories) {
        const work = measures.calories * 4184; // 1 calorie = ~4184 Joules
        totalWork += work;
      }
    } else {
      // Simplified weight calculation - always consider bodyweight with factor
      const weight = (athlete.weight * constants.bodyweightFactor) + (measures.externalLoad || 0);
      const force = weight * (acceleration / 9.81); // Normalize to gravity

      // Calculate distance to use
      let distance = constants.defaultDistance;

      // Calculate limb-based distance adjustments
      let limbBasedDistance = 0;
      if (constants.armLengthFactor && athlete.armLength) {
        limbBasedDistance += athlete.armLength * constants.armLengthFactor;
      }
      if (constants.legLengthFactor && athlete.legLength) {
        limbBasedDistance += athlete.legLength * constants.legLengthFactor;
      }

      // Use the limb-based distance if any limb factors were applied
      if (limbBasedDistance > 0) {
        distance = limbBasedDistance;
      }

      // For continuous movement (like running), use distance directly if provided
      if (measures.distance) {
        distance = measures.distance;
      }

      // Ensure we have reps (default to 1 for continuous movements)
      const reps = measures.reps || 1;

      // Calculate work for this measure
      const work = force * distance * reps;
      totalWork += work;
    }
  });

  // Calculate power if time is provided
  if (time) {
    const power = totalWork / time; // kW
    return { work: totalWork, power };
  }
  return { work: totalWork };
}