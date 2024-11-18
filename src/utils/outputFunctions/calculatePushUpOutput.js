export const calculatePushUpOutput = (athlete, measures) => {
    const bodyweight = athlete.weight; // Athlete's weight in kg
    const reps = measures.reps || 0; // Reps completed
    const time = measures.time || null; // Optional time for power calculation
  
    // General function: use default distance
    const defaultDistance = 0.5; // Meters per rep (average arm length approximation)
    let distance = defaultDistance;
  
    // Complex function: override distance if limb length is available
    if (athlete.limbLength) {
      distance = athlete.limbLength / 2; // Approximate distance moved (half of limb length)
    }
  
    const work = bodyweight * distance * reps; // Work = weight x distance x reps
    if (time) {
      const power = work / time; // Power = Work / Time
      return { work, power };
    }
    return { work };
  };
  