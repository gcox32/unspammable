export const calculateBackSquatOutput = (athlete, measures) => {
    const weight = measures.weight || 0; // Barbell weight in kg
    const reps = measures.reps || 0; // Reps completed
    const time = measures.time || null; // Optional time for power calculation
  
    // General function: use default squat depth
    const defaultDistance = 0.8; // Meters per rep (average squat depth)
    let distance = defaultDistance;
  
    // Complex function: override distance if leg length is available
    if (athlete.legLength) {
      distance = athlete.legLength / 2; // Approximate squat depth as half of leg length
    }
  
    const work = weight * distance * reps; // Work = weight x distance x reps
    if (time) {
      const power = work / time; // Power = Work / Time
      return { work, power };
    }
    return { work };
  };
  