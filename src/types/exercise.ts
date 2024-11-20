export interface ExerciseMeasures {
  externalLoad?: number;
  reps?: number;
  distance?: number;
  time?: number;
  calories?: number;
}

export interface AthleteMetrics {
  weight: number;
  height: number;
  limbLength?: number;
  legLength?: number;
}

export interface UnitPreferences {
  weight: 'metric' | 'imperial';
  height: 'metric' | 'imperial';
  externalLoad: 'metric' | 'imperial';
  distance: 'metric' | 'imperial';
  limbLength: 'metric' | 'imperial';
  legLength: 'metric' | 'imperial';
}

export const EXERCISE_CATEGORIES = {
  bodyweight: ["Push-Up", "Pull-Up"],
  strength: ["Back Squat", "Deadlift", "Shoulder Press"],
  cardio: ["Run", "Bike", "Row"]
} as Record<string, string[]>; 