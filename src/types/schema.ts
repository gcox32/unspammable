export interface Athlete {
    id: string;
    sub: string | null;
    name: string | null;
    email: string | null;
    profile?: Profile | null;
    trackingMetrics?: TrackingMetric[] | null;
    workoutLogs?: WorkoutLog[] | null;
}

export interface Profile {
    id: string;
    athleteId: string;
    age?: number | null;
    gender?: string | null;
    height?: number | null;
    weight?: number | null;
    homeGym?: string | null;
    athlete?: Athlete | null;
}

export interface TrackingMetric {
    id: string;
    type: string | null;
    unit: string | null;
    athleteId: string;
    athlete?: Athlete | null;
    entries?: TrackingMetricEntry[] | null;
}

export interface TrackingMetricEntry {
    id: string;
    date: Date | null;
    value: number | null;
    trackingMetricId: string;
    trackingMetric?: TrackingMetric | null;
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
    exercise?: ExerciseTemplate | null;
    workoutComponentTemplate?: WorkoutComponentTemplate | null;
}

export interface ExerciseTemplate {
    id: string;
    name: string;
    description?: string;
    outputConstants?: Record<string, any>;
    videoUrl?: string;
    category?: string;
    equipment?: string[];
    workoutComponents?: 
      | WorkoutComponentTemplateExercise[]
      | null;
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
