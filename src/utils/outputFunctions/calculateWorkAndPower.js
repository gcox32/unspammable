export const calculateWorkAndPower = (weight, distance, reps, time = null) => {
    const work = weight * distance * reps; // Work = weight x distance x reps
    if (time) {
      const power = work / time; // Power = Work / Time
      return { work, power };
    }
    return { work };
  };
  