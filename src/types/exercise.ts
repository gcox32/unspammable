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
  armLength?: number;
  legLength?: number;
}

export interface UnitPreferences {
  weight: 'metric' | 'imperial';
  height: 'metric' | 'imperial';
  externalLoad: 'metric' | 'imperial';
  distance: 'metric' | 'imperial';
  armLength: 'metric' | 'imperial';
  legLength: 'metric' | 'imperial';
}


export interface ExerciseDefinition {
  name: string;
  availableMeasures: (keyof ExerciseMeasures)[];
}

export const EXERCISE_CATEGORIES = {
  bodyweight: [
    {
      name: "Push-Up",
      availableMeasures: ['reps', 'externalLoad']
    },
    {
      name: "Pull-Up",
      availableMeasures: ['reps', 'externalLoad']
    }
  ],
  strength: [
    {
      name: "Back Squat",
      availableMeasures: ['reps', 'externalLoad']
    },
    {
      name: "Deadlift",
      availableMeasures: ['reps', 'externalLoad']
    },
    {
      name: "Shoulder Press",
      availableMeasures: ['reps', 'externalLoad']
    }
  ],
  cardio: [
    {
      name: "Run",
      availableMeasures: ['distance', 'externalLoad']
    },
    {
      name: "Bike",
      availableMeasures: ['calories', 'distance']
    },
    {
      name: "Row",
      availableMeasures: ['calories', 'distance']
    }
  ]
} as Record<string, ExerciseDefinition[]>; 