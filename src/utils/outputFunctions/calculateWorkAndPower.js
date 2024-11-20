export const calculateWorkAndPower = (weight, distance, reps, time = null) => {
    const work = (weight * distance * reps) / 1000; // measured in kJ
    if (time) {
      const power = work / time; // measured in kW
      return { work, power, time };
    }
    return { work, time };
  };
  