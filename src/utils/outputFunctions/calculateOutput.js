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
      heightFactor: 0,
      armLengthFactor: 1,
      legLengthFactor: 1,
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

      // Calculate base movement distance
      let distance = 0;

      // Distance Calculation Logic:
      // 1. Total distance is the sum of three possible components:
      //    - Arm component: (armLength * armLengthFactor)
      //    - Leg component: (legLength * legLengthFactor)
      //    - Height component: (height * heightFactor)
      // 2. Each factor determines what portion of that measurement to use:
      //    - Factor of 0: measurement not used
      //    - Factor of 1: full measurement used
      //    - Factor of 0.5: half of measurement used
      // 3. Examples:
      //    - Front Squat: armLengthFactor=0, legLengthFactor=0.6, heightFactor=0
      //      distance = (0 * armLength) + (0.6 * legLength) + (0 * height)
      //    - Vertical Jump: armLengthFactor=0, legLengthFactor=0, heightFactor=0.5
      //      distance = (0 * armLength) + (0 * legLength) + (0.5 * height)
      
      // Add arm-based component if specified
      if (constants.armLengthFactor && athlete.armLength) {
        distance += athlete.armLength * constants.armLengthFactor / 100;
      }

      // Add leg-based component if specified
      if (constants.legLengthFactor && athlete.legLength) {
        distance += athlete.legLength * constants.legLengthFactor / 100;
      }

      // Add height-based component if specified
      if (constants.heightFactor > 0 && athlete?.height) {
        distance += athlete.height * constants.heightFactor / 100; // Convert cm to meters
      }

      // If no biometric-based distance was calculated, use default
      if (distance === 0 && constants.defaultDistance) {
        distance = constants.defaultDistance;
      }

      // Allow manual distance override
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
    const power = totalWork / time;
    return { work: totalWork, power };
  }
  return { work: totalWork };
}