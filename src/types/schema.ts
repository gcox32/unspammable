export interface Athlete {
    id: string;
    sub: string;
    firstName: string;
    lastName: string;
    email: string;
    birthdate?: Date | null | string | undefined;
    gender?: 'Male' | 'Female' | null | undefined;
    accessTelehealth?: boolean | null | undefined;
    avatarUrl?: string | null | undefined;
    height?: number | null | undefined;
    weight?: number | null | undefined;
    homeGym?: string | null | undefined;
    trackingMetrics?: TrackingMetric[];
    workoutLogs?: WorkoutLog[];
}

export interface TrackingMetric {
    id: string;
    type: string;
    unit: string;
    athleteId: string;
    athlete?: Athlete;
    entries?: TrackingMetricEntry[];
}

export interface TrackingMetricEntry {
    id: string;
    date: Date;
    value: number;
    trackingMetricId: string;
    trackingMetric?: TrackingMetric;
}

export interface WorkoutTemplate {
    id: string;
    name: string;
    description?: string;
    workoutInstances?: WorkoutInstance[];
    workoutComponentTemplates?: WorkoutTemplateComponent[];
}

export interface WorkoutComponentTemplate {
    id: string;
    workoutTemplateId: string;
    name: string | null;
    description?: string | null;
    sequenceOrder: number | null;
    workoutTemplate?: WorkoutTemplate | null;
    workoutComponentLogs?: WorkoutComponentLog[] | null;
    exercises?: WorkoutComponentTemplateExercise[] | null;
    scores?: WorkoutComponentTemplateScore[] | null;
}

export interface WorkoutComponentTemplateScore {
    id: string;
    workoutComponentTemplateId: string;
    workoutComponentTemplate?: WorkoutComponentTemplate | null;
    measures?: Measure[] | null;
}

export interface Measure {
    id: string;
    workoutComponentTemplateScoreId: string;
    type: string | null;
    unit: string | null;
    workoutComponentTemplateScore?: WorkoutComponentTemplateScore | null;
    measureValue?: MeasureValue | null;
    exerciseLogs?: ExerciseLogMeasure[] | null;
}

export interface MeasureValue {
    id: string;
    measureId: string;
    amount?: number | null;
    measure?: Measure | null;
}

export interface WorkoutComponentTemplateExercise {
    id: string;
    workoutComponentTemplateId: string;
    exerciseTemplateId: string;
    externalLoadPrimary?: number | null;
    externalLoadSecondary?: number | null;
    reps?: number | null;
    distance?: number | null;
    time?: number | null;
    calories?: number | null;
    exercise?: ExerciseTemplate | null;
    workoutComponentTemplate?: WorkoutComponentTemplate | null;
}

export interface ExerciseTemplate {
    id: string;
    name: string;
    description?: string;
    outputConstants?: ExerciseOutputConstants;
    workoutComponents?: WorkoutComponentTemplateExercise[];
    exerciseLogs?: ExerciseLog[];
    videoUrl?: string;
    videoEmbed?: string;
    category?: 'Strength' | 'Cardio' | 'Gymnastics' | 'Weightlifting' | 'Plyometric' | 'Other';
    equipment?: string[];
    patternPrimary?: string;
    patternSecondary?: string;
    unilateral?: boolean;
    plane?: 'Sagittal' | 'Frontal' | 'Transverse' | 'Multiple' | 'Other';
}

export interface WorkoutInstance {
    id: string;
    date: Date | null;
    workoutTemplateId: string;
    workoutTemplate?: WorkoutTemplate | null;
    workoutLogs?: WorkoutLog[] | null;
}

export interface WorkoutLog {
    id: string;
    workoutInstanceId: string;
    athleteId: string;
    completionDate: Date | null;
    asPrescribed?: boolean | null;
    outputScore?: WorkoutLogOutputScore | null;
    workoutInstance?: WorkoutInstance | null;
    athlete?: Athlete | null;
    workoutComponentLogs?: WorkoutComponentLog[] | null;
}

export interface WorkoutComponentLog {
    id: string;
    workoutLogId: string;
    workoutComponentTemplateId: string;
    status: string | null;
    asPrescribed?: boolean | null;
    workoutLog?: WorkoutLog | null;
    workoutComponentTemplate?: WorkoutComponentTemplate | null;
    exerciseLogs?: ExerciseLog[] | null;
}

export interface ExerciseLog {
    id: string;
    workoutComponentLogId: string;
    exerciseTemplateId: string;
    asPrescribed?: boolean | null;
    workoutComponentLog?: WorkoutComponentLog | null;
    exercise?: ExerciseTemplate | null;
    measureValues?: ExerciseLogMeasure[] | null;
}

export interface ExerciseLogMeasure {
    id: string;
    exerciseLogId: string;
    measureId: string;
    actualValue: number | null;
    exerciseLog?: ExerciseLog | null;
    measure?: Measure | null;
}

// Interpretation AI Model type
export interface InterpretationInput {
    content: string | null;
}

export interface InterpretationOutput {
    interpretation: string | null;
}

export interface ExerciseOutputConstants {
    id: string;
    defaultDistance?: number;
    bodyweightFactor?: number;
    heightFactor?: number;
    armLengthFactor?: number;
    legLengthFactor?: number;
    useCalories?: boolean;
    exerciseTemplateId: string;
    exerciseTemplate?: ExerciseTemplate;
}

export interface WorkoutTemplateComponent {
    id: string;
    workoutTemplateId: string;
    workoutComponentTemplateId: string;
    workoutTemplate?: WorkoutTemplate;
    workoutComponentTemplate?: WorkoutComponentTemplate;
}

export interface WorkoutLogOutputScore {
    id: string;
    workoutLogId: string;
    totalWork?: number | null;
    averagePower?: number | null;
    totalTime?: number | null;
    workoutLog?: WorkoutLog | null;
}