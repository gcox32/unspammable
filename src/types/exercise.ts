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

export const EXERCISE_FIELDS = [
  {
    name: 'name',
    label: 'Exercise Name',
    type: 'text' as const,
    required: true,
    placeholder: 'e.g., Back Squat'
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea' as const,
    placeholder: 'Describe the exercise...'
  },
  {
    name: 'category',
    label: 'Category',
    type: 'select' as const,
    required: true,
    options: ['Strength', 'Cardio', 'Gymnastics', 'Weightlifting', 'Plyometric', 'Other']
  },
  {
    name: 'equipment',
    label: 'Equipment Required',
    type: 'multiselect' as const,
    options: [
      'Barbell',
      'Rack',
      'Dumbbell',
      'Kettlebell',
      'Pull-up Bar',
      'Rings',
      'Rower',
      'Bike',
      'Jump Rope',
      'Bench',
      'Box',
      'Bands',
      'Medicine Ball',
      'Sandbag',
      'Plates',
      'Pulley',
      'Wheel',
      'Suspension',
      'Mats',
      'Wall',
      'Battle Rope',
      'Other',
      'None'
    ]
  },
  {
    name: 'videoUrl',
    label: 'Demo Video URL',
    type: 'url' as const,
    placeholder: 'https://...'
  },
  {
    name: 'videoEmbed',
    label: 'Video Embed Code',
    type: 'textarea' as const,
    placeholder: '<div>...</div>'
  },
  {
    name: 'outputConstants',
    label: 'Output Score Constants',
    type: 'section' as const,
    fields: [
      {
        name: 'bodyweightFactor',
        label: 'Bodyweight Factor',
        type: 'number' as const,
        placeholder: '0.0 to 1.0',
        min: 0,
        max: 1,
        step: 0.1,
        tooltip: 'Percentage of bodyweight used in force calculation'
      },
      {
        name: 'defaultDistance',
        label: 'Default Movement Distance (m)',
        type: 'number' as const,
        placeholder: 'e.g. 0.5',
        min: 0,
        step: 0.1,
        tooltip: 'Default distance of movement in meters'
      },
      {
        name: 'heightFactor',
        label: 'Height Factor',
        type: 'number' as const,
        placeholder: '0.0 to 2.0',
        min: 0,
        max: 2,
        step: 0.1,
        tooltip: 'Multiplier for height in distance calculations'
      },
      {
        name: 'armLengthFactor',
        label: 'Arm Length Factor',
        type: 'number' as const,
        placeholder: '0.0 to 2.0',
        min: 0,
        max: 2,
        step: 0.1,
        tooltip: 'Multiplier for arm length in distance calculations'
      },
      {
        name: 'legLengthFactor',
        label: 'Leg Length Factor',
        type: 'number' as const,
        placeholder: '0.0 to 2.0',
        min: 0,
        max: 2,
        step: 0.1,
        tooltip: 'Multiplier for leg length in distance calculations'
      },
      {
        name: 'useCalories',
        label: 'Calculation Method',
        type: 'select' as const,
        options: [
          { value: 'force-distance', label: 'Force × Distance' },
          { value: 'calories', label: 'Calories' }
        ],
        defaultValue: 'force-distance',
        tooltip: 'Calculate work using F × d or reported calories'
      }
    ]
  },
  {
    name: 'patternPrimary',
    label: 'Primary Movement Pattern',
    type: 'select' as const,
    options: [
      'Horizontal Press', 'Vertical Press', 'Horizontal Pull', 'Vertical Pull', 
      'Knee Dominant', 'Hip Dominant', 'Hybrid Lower', 'Hybrid Upper', 'Combo', 
      'Olympic', 'Locomotion', 'Plyometric', 'Core', 'Isolation Upper', 'Isolation Lower', 
      'Rope', 'Carry', 'Other'
    ]
  },
  {
    name: 'patternSecondary',
    label: 'Secondary Movement Pattern',
    type: 'select' as const,
    options: [
      'Horizontal Press', 'Vertical Press', 'Horizontal Pull', 'Vertical Pull', 
      'Knee Dominant', 'Hip Dominant', 'Hybrid Lower', 'Hybrid Upper', 'Combo', 
      'Olympic', 'Locomotion', 'Plyometric', 'Core', 'Isolation Upper', 'Isolation Lower', 
      'Rope', 'Carry', 'Other'
    ]
  },
  {
    name: 'unilateral',
    label: 'Movement Type',
    type: 'select' as const,
    options: [
      { value: 'bilateral', label: 'Bilateral' },
      { value: 'unilateral', label: 'Unilateral' }
    ],
    defaultValue: 'bilateral',
    tooltip: 'Whether the movement is performed on one side at a time'
  },
  {
    name: 'plane',
    label: 'Movement Plane',
    type: 'select' as const,
    options: ['Sagittal', 'Frontal', 'Transverse', 'Multiple', 'Other']
  }
];

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