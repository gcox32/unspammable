export interface Athlete {
    id: string;
    sub: string;
    firstName: string;
    lastName: string;
    email: string;
    accessTelehealth?: boolean;
    profile?: Profile;
    trackingMetrics?: TrackingMetric[];
    workoutLogs?: WorkoutLog[];
}

export interface Profile {
    id: string;
    athleteId: string;
    avatarUrl?: string;
    birthdate?: Date;
    gender?: 'Male' | 'Female';
    height?: number;
    weight?: number;
    homeGym?: string;
    athlete?: Athlete;
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
    name: string | null;
    description?: string | null;
    workoutInstances?: WorkoutInstance[] | null;
    workoutComponentTemplates?: WorkoutComponentTemplate[] | null;
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
    outputConstants?: Record<string, any>;
    videoUrl?: string;
    videoEmbed?: string;
    category?: 'Strength' | 'Cardio' | 'Gymnastics' | 'Weightlifting' | 'Other';
    equipment?: string[];
    patternPrimary?: 'Horizontal_Press' | 'Vertical_Press' | 'Horizontal_Pull' | 'Vertical_Pull' | 'Knee_Dominant' | 'Hip_Dominant' | 'Hybrid_Lower' | 'Hybrid_Upper' | 'Combo' | 'Olympic' | 'Locomotion' | 'Plyometric' | 'Core' | 'Isolation_Upper' | 'Isolation_Lower' | 'Rope' | 'Carry' | 'Other';
    patternSecondary?: 'Horizontal_Press' | 'Vertical_Press' | 'Horizontal_Pull' | 'Vertical_Pull' | 'Knee_Dominant' | 'Hip_Dominant' | 'Hybrid_Lower' | 'Hybrid_Upper' | 'Combo' | 'Olympic' | 'Locomotion' | 'Plyometric' | 'Core' | 'Isolation_Upper' | 'Isolation_Lower' | 'Rope' | 'Carry' | 'Other';
    unilateral?: boolean;
    plane?: 'Sagittal' | 'Frontal' | 'Transverse' | 'Multiple' | 'Other';
    workoutComponents?: WorkoutComponentTemplateExercise[] | null;
    exerciseLogs?: ExerciseLog[];
    updatedAt?: string;
    createdAt?: string;
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
