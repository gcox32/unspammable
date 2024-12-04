import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

// Define the schema
const schema = a.schema({
  // Athletes: User information
  Athlete: a.model({
    id: a.id().required(),
    sub: a.string().required(),
    firstName: a.string().required(),
    lastName: a.string().required(),
    email: a.string().required(),
    birthdate: a.date(),
    gender: a.enum(['Male', 'Female']),
    accessTelehealth: a.boolean(),
    avatarUrl: a.string()
      .authorization(allow => [
        allow.groups(["ADMIN", "COACH", "ATHLETE"])
      ]),
    height: a.float()
      .authorization(allow => [
        allow.groups(["ADMIN", "COACH", "ATHLETE"])
      ]),
    weight: a.float()
      .authorization(allow => [
        allow.groups(["ADMIN", "COACH", "ATHLETE"])
      ]),
    armLength: a.float()
      .authorization(allow => [
        allow.groups(["ADMIN", "COACH", "ATHLETE"])
      ]),
    legLength: a.float()
      .authorization(allow => [
        allow.groups(["ADMIN", "COACH", "ATHLETE"])
      ]),
    homeGym: a.string()
      .authorization(allow => [
        allow.groups(["ADMIN", "COACH", "ATHLETE"])
      ]),
    trackingMetrics: a.hasMany('TrackingMetric', 'athleteId'),
    workoutLogs: a.hasMany('WorkoutLog', 'athleteId')
  }).authorization(allow => [
    allow.group("ADMIN"),
    allow.group("COACH"),
    allow.group("ATHLETE").to(["read"])
  ]),

  // Tracking Metrics: Metrics tracked by athletes tied to dates; e.g. bodyweight, bodyfat, etc.
  TrackingMetric: a.model({
    id: a.id().required(),
    type: a.string().required(),
    unit: a.string().required(),
    athleteId: a.id().required(),
    athlete: a.belongsTo('Athlete', 'athleteId'),
    entries: a.hasMany('TrackingMetricEntry', 'trackingMetricId')
  }).authorization(allow => [
    allow.groups(["ADMIN", "COACH", "ATHLETE"])
  ]),
  TrackingMetricEntry: a.model({
    id: a.id().required(),
    date: a.datetime().required(),
    value: a.float().required(),
    trackingMetricId: a.id().required(),
    trackingMetric: a.belongsTo('TrackingMetric', 'trackingMetricId')
  }).authorization(allow => [
    allow.groups(["ADMIN", "COACH", "ATHLETE"])
  ]),

  // AI generation

  // Templates: Prescribed workouts with components and exercises
  WorkoutTemplate: a.model({
    id: a.id().required(),
    name: a.string().required(),
    description: a.string(),
    workoutInstances: a.hasMany('WorkoutInstance', 'workoutTemplateId'),
    workoutComponentTemplates: a.hasMany('WorkoutTemplateComponent', 'workoutTemplateId')
  }).authorization(allow => [
    allow.group("ADMIN"),
    allow.group("COACH").to(["read"]),
    allow.group("ATHLETE").to(["read"])
  ]),
  WorkoutTemplateComponent: a.model({
    id: a.id().required(),
    workoutTemplateId: a.id().required(),
    workoutComponentTemplateId: a.id().required(),
    workoutTemplate: a.belongsTo('WorkoutTemplate', 'workoutTemplateId'),
    workoutComponentTemplate: a.belongsTo('WorkoutComponentTemplate', 'workoutComponentTemplateId')
  }).authorization(allow => [
    allow.group("ADMIN"),
    allow.group("COACH").to(["read"]),
  ]),
  WorkoutComponentTemplate: a.model({
    id: a.id().required(),
    name: a.string().required(),
    description: a.string(),
    style: a.string(),
    sequenceOrder: a.integer().required(),
    tags: a.string().array(),
    workoutTemplateComponent: a.hasMany('WorkoutTemplateComponent', 'workoutComponentTemplateId'),
    workoutComponentLogs: a.hasMany('WorkoutComponentLog', 'workoutComponentTemplateId'),
    exercises: a.hasMany('WorkoutComponentTemplateExercise', 'workoutComponentTemplateId'),
    scores: a.hasMany('WorkoutComponentTemplateScore', 'workoutComponentTemplateId'),
  }).authorization(allow => [
    allow.group("ADMIN"),
    allow.group("COACH").to(["read"]),
    allow.group("ATHLETE").to(["read"])
  ]),
  WorkoutComponentTemplateScore: a.model({
    id: a.id().required(),
    workoutComponentTemplateId: a.id().required(),
    workoutComponentTemplate: a.belongsTo('WorkoutComponentTemplate', 'workoutComponentTemplateId'),
    measures: a.hasMany('Measure', 'workoutComponentTemplateScoreId')
  }).authorization(allow => [
    allow.group("ADMIN"),
    allow.group("COACH").to(["read"]),
    allow.group("ATHLETE").to(["read"])
  ]),
  Measure: a.model({
    id: a.id().required(),
    label: a.string().required(),
    workoutComponentTemplateScoreId: a.id().required(),
    type: a.string().required(),
    unit: a.string().required(),
    workoutComponentTemplateScore: a.belongsTo('WorkoutComponentTemplateScore', 'workoutComponentTemplateScoreId'),
    measureValue: a.hasOne('MeasureValue', 'measureId'),
    exerciseLogs: a.hasMany('ExerciseLogMeasure', 'measureId')
  }).authorization(allow => [
    allow.group("ADMIN"),
    allow.group("COACH").to(["read"]),
    allow.group("ATHLETE").to(["read"])
  ]),
  MeasureValue: a.model({
    id: a.id().required(),
    measureId: a.id().required(),
    amount: a.float(),
    measure: a.belongsTo('Measure', 'measureId')
  }).authorization(allow => [
    allow.group("ADMIN"),
    allow.group("COACH"),
    allow.group("ATHLETE").to(["read"])
  ]),
  WorkoutComponentTemplateExercise: a.model({
    id: a.id().required(),
    workoutComponentTemplateId: a.id().required(),
    exerciseTemplateId: a.id().required(),
    externalLoadPrimary: a.float(),
    externalLoadSecondary: a.float(),
    reps: a.integer(),
    distance: a.float(),
    time: a.float(),
    calories: a.float(),
    exercise: a.belongsTo('ExerciseTemplate', 'exerciseTemplateId'),
    workoutComponentTemplate: a.belongsTo('WorkoutComponentTemplate', 'workoutComponentTemplateId')
  }).authorization(allow => [
    allow.group("ADMIN"),
    allow.group("COACH").to(["read"]),
    allow.group("ATHLETE").to(["read"])
  ]),
  ExerciseTemplate: a.model({
    id: a.id().required(),
    name: a.string().required(),
    description: a.string(),
    outputConstants: a.hasOne('ExerciseOutputConstants', 'exerciseTemplateId'),
    workoutComponents: a.hasMany('WorkoutComponentTemplateExercise', 'exerciseTemplateId'),
    exerciseLogs: a.hasMany('ExerciseLog', 'exerciseTemplateId'),
    videoUrl: a.string(),
    videoEmbed: a.string(),
    category: a.enum(['Strength', 'Cardio', 'Gymnastics', 'Weightlifting', 'Plyometric', 'Other']),
    equipment: a.string().array(),
    patternPrimary: a.string(),
    patternSecondary: a.string(),
    unilateral: a.boolean(),
    plane: a.enum(['Sagittal', 'Frontal', 'Transverse', 'Multiple', 'Other'])
  }).authorization(allow => [
    allow.group("ADMIN"),
    allow.group("COACH").to(["read"]),
    allow.group("ATHLETE").to(["read"])
  ]),
  ExerciseOutputConstants: a.model({
    id: a.id().required(),
    defaultDistance: a.float(),
    bodyweightFactor: a.float(),
    heightFactor: a.float(),
    armLengthFactor: a.float(),
    legLengthFactor: a.float(),
    useCalories: a.boolean(),
    exerciseTemplateId: a.id().required(),
    exerciseTemplate: a.belongsTo('ExerciseTemplate', 'exerciseTemplateId')
  }).authorization(allow => [
    allow.group("ADMIN")
  ]),

  // Instances (actual workouts with dates and perscribed workloads)
  WorkoutInstance: a.model({
    id: a.id().required(),
    date: a.datetime().required(),
    workoutTemplateId: a.id().required(),
    workoutTemplate: a.belongsTo('WorkoutTemplate', 'workoutTemplateId'),
    workoutLogs: a.hasMany('WorkoutLog', 'workoutInstanceId')
  }).authorization(allow => [
    allow.group("ADMIN"),
    allow.group("COACH").to(["read"]),
    allow.group("ATHLETE").to(["read"])
  ]),

  // Logs: Actual workouts completed by athletes
  WorkoutLog: a.model({
    id: a.id().required(),
    workoutInstanceId: a.id().required(),
    athleteId: a.id().required(),
    completionDate: a.datetime().required(),
    asPrescribed: a.boolean(),
    outputScore: a.hasOne('WorkoutLogOutputScore', 'workoutLogId'),
    workoutInstance: a.belongsTo('WorkoutInstance', 'workoutInstanceId'),
    athlete: a.belongsTo('Athlete', 'athleteId'),
    workoutComponentLogs: a.hasMany('WorkoutComponentLog', 'workoutLogId')
  }).authorization(allow => [
    allow.groups(["ADMIN", "COACH", "ATHLETE"])
  ]),
  WorkoutLogOutputScore: a.model({
    id: a.id().required(),
    workoutLogId: a.id().required(),
    totalWork: a.float(),
    averagePower: a.float(),
    totalTime: a.float(),
    workoutLog: a.belongsTo('WorkoutLog', 'workoutLogId')
  }).authorization(allow => [
    allow.groups(["ADMIN", "COACH", "ATHLETE"])
  ]),
  WorkoutComponentLog: a.model({
    id: a.id().required(),
    workoutLogId: a.id().required(),
    workoutComponentTemplateId: a.id().required(),
    status: a.string().required(),
    asPrescribed: a.boolean(),
    workoutLog: a.belongsTo('WorkoutLog', 'workoutLogId'),
    workoutComponentTemplate: a.belongsTo('WorkoutComponentTemplate', 'workoutComponentTemplateId'),
    exerciseLogs: a.hasMany('ExerciseLog', 'workoutComponentLogId')
  }).authorization(allow => [
    allow.groups(["ADMIN", "COACH", "ATHLETE"])
  ]),

  ExerciseLog: a.model({
    id: a.id().required(),
    workoutComponentLogId: a.id().required(),
    exerciseTemplateId: a.id().required(),
    asPrescribed: a.boolean(),
    workoutComponentLog: a.belongsTo('WorkoutComponentLog', 'workoutComponentLogId'),
    exercise: a.belongsTo('ExerciseTemplate', 'exerciseTemplateId'),
    measureValues: a.hasMany('ExerciseLogMeasure', 'exerciseLogId')
  }).authorization(allow => [
    allow.groups(["ADMIN", "COACH", "ATHLETE"])
  ]),

  ExerciseLogMeasure: a.model({
    id: a.id().required(),
    exerciseLogId: a.id().required(),
    measureId: a.id().required(),
    actualValue: a.float().required(),
    exerciseLog: a.belongsTo('ExerciseLog', 'exerciseLogId'),
    measure: a.belongsTo('Measure', 'measureId')
  }).authorization(allow => [
    allow.groups(["ADMIN", "COACH", "ATHLETE"])
  ])

});

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool'
  }
});