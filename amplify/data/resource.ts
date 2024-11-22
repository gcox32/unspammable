import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

// Define the schema
const schema = a.schema({
  // Athletes: User information
  Athlete: a.model({
    id: a.id().required(),
    sub: a.string().required(),
    name: a.string().required(),
    email: a.string().required(),
    profile: a.hasOne('Profile', 'athleteId'),
    trackingMetrics: a.hasMany('TrackingMetric', 'athleteId')
  }).authorization(allow => [
    allow.group("ADMIN"),
    allow.group("COACH"),
    allow.group("ATHLETE").to(["read"])
  ]),
  Profile: a.model({
    id: a.id().required(),
    athleteId: a.id().required(),
    age: a.integer(),
    gender: a.string(),
    height: a.float(),
    weight: a.float(),
    homeGym: a.string(),
    athlete: a.belongsTo('Athlete', 'athleteId')
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

  // // Templates: Prescribed workouts with parts and exercises
  // WorkoutTemplate: a.model({
  //   id: a.id().required(),
  //   name: a.string().required(),
  //   description: a.string(),
  //   workoutInstances: a.hasMany('WorkoutInstance', 'workoutTemplateId'),
  //   workoutPartTemplates: a.hasMany('WorkoutPartTemplate', 'workoutTemplateId')
  // }).authorization(allow => [
  //   allow.group("ADMIN"),
  //   allow.group("COACH").to(["read"]),
  //   allow.group("ATHLETE").to(["read"])
  // ]),
  // WorkoutPartTemplate: a.model({
  //   workoutPartTemplateId: a.id().required(),
  //   workoutTemplateId: a.id().required(),
  //   name: a.string().required(),
  //   sequenceOrder: a.integer().required(),
  //   workoutTemplate: a.belongsTo('WorkoutTemplate', 'workoutTemplateId'),
  //   exercises: a.hasMany('WorkoutPartTemplateExercise', 'workoutPartTemplateId'),
  //   scores: a.hasMany('WorkoutPartTemplateScore', 'workoutPartTemplateId'),
  // }).authorization(allow => [
  //   allow.group("ADMIN"),
  //   allow.group("COACH").to(["read"]),
  //   allow.group("ATHLETE").to(["read"])
  // ]),
  // WorkoutPartTemplateScore: a.model({
  //   id: a.id().required(),
  //   workoutPartTemplateId: a.id().required(),
  //   part: a.belongsTo('WorkoutPartTemplate', 'workoutPartTemplateId'),
  //   measures: a.hasMany('Measure', 'workoutPartTemplateScoreId')
  // }).authorization(allow => [
  //   allow.group("ADMIN"),
  //   allow.group("COACH").to(["read"]),
  //   allow.group("ATHLETE").to(["read"])
  // ]),
  // WorkoutPartTemplateExercise: a.model({
  //   workoutPartTemplateExerciseId: a.id().required(),
  //   workoutPartTemplateId: a.id().required(),
  //   exerciseTemplateId: a.id().required(),
  //   exercise: a.belongsTo('ExerciseTemplate', 'workoutPartTemplateId'),
  //   partTemplate: a.belongsTo('WorkoutPartTemplate', 'workoutPartTemplateId')
  // }).authorization(allow => [
  //   allow.group("ADMIN"),
  //   allow.group("COACH").to(["read"]),
  //   allow.group("ATHLETE").to(["read"])
  // ]),
  // ExerciseTemplate: a.model({
  //   exerciseTemplateId: a.id().required(),
  //   name: a.string().required(),
  //   workoutPartTemplateId: a.id().required(),
  //   description: a.string(),
  //   outputFunction: a.string(), // Optional function name to calculate the output score
  //   videoUrl: a.string(), // Optional URL to a demo video
  //   category: a.string(), // Optional category (e.g., "Strength")
  //   equipment: a.string().array(), // Optional list of required equipment
  //   workoutPartTemplate: a.hasMany('WorkoutPartTemplateExercise', 'workoutPartTemplateId'),
  //   exerciseLogs: a.hasMany('ExerciseLog', 'exerciseTemplateId')
  // }).authorization(allow => [
  //   allow.group("ADMIN"),
  //   allow.group("COACH").to(["read"]),
  //   allow.group("ATHLETE").to(["read"])
  // ]),

  // // Instances (actual workouts with dates and perscribed workloads)
  // WorkoutInstance: a.model({
  //   id: a.id().required(),
  //   date: a.datetime().required(),
  //   workoutTemplateId: a.id().required(),
  //   workoutTemplate: a.belongsTo('WorkoutTemplate', 'workoutTemplateId'),
  //   workoutPartInstances: a.hasMany('WorkoutPartInstance', 'workoutInstanceId'),
  //   workoutLogs: a.hasMany('WorkoutLog', 'workoutInstanceId')
  // }).authorization(allow => [
  //   allow.group("ADMIN"),
  //   allow.group("COACH").to(["read"]),
  //   allow.group("ATHLETE").to(["read"])
  // ]),

  // // Logs (performed workouts by athletes with measures and calculated scores)
  // WorkoutLog: a.model({
  //   id: a.id().required(),
  //   workoutId: a.id().required(),
  //   athleteId: a.id().required(),
  //   asPrescribed: a.boolean(),
  //   athlete: a.belongsTo('Athlete', 'athleteId'),
  //   workoutInstance: a.belongsTo('WorkoutInstance', 'workoutInstanceId'),
  //   partLogs: a.hasMany('WorkoutPartLog', 'workoutLogId')
  // }).authorization(allow => [
  //   allow.groups(["ADMIN", "COACH", "ATHLETE"])
  // ]),
  // WorkoutPartLog: a.model({
  //   workoutPartLogId: a.id().required(),
  //   workoutLogId: a.id().required(),
  //   workoutPartTemplateId: a.id().required(),
  //   status: a.string(),
  //   asPrescribed: a.boolean(),
  //   partTemplate: a.belongsTo('WorkoutPartTemplate', 'workoutPartTemplateId'),
  //   exerciseLogs: a.hasMany('ExerciseLog', 'workoutPartLogId'),
  //   log: a.belongsTo('WorkoutLog', 'workoutLogId')
  // }).authorization(allow => [
  //   allow.groups(["ADMIN", "COACH", "ATHLETE"])
  // ]),
  // ExerciseLog: a.model({
  //   exerciseLogId: a.id().required(),
  //   exerciseTemplateId: a.id().required(),
  //   workoutPartLogId: a.id().required(),
  //   actualValues: a.hasOne('MeasureValue', 'measureValueId'),
  //   outputScore: a.hasOne('OutputScore', 'exerciseLogId'),
  //   asPrescribed: a.boolean(),
  //   exercise: a.belongsTo('ExerciseTemplate', 'exerciseTemplateId'),
  //   partLog: a.belongsTo('WorkoutPartLog', 'workoutPartLogId')
  // }).authorization(allow => [
  //   allow.groups(["ADMIN", "COACH", "ATHLETE"])
  // ]),

  // // Scores: Calculated and reported scores for exercise and workout part instances
  // OutputScore: a.model({
  //   outputScoreId: a.id().required(),
  //   exerciseLogId: a.id().required(),
  //   scoreWork: a.float(),
  //   scorePower: a.float(),
  //   scoreTime: a.float(),
  //   exerciseLog: a.belongsTo('ExerciseLog', 'exerciseLogId')
  // }).authorization(allow => [
  //   allow.group("ADMIN"),
  //   allow.group("COACH").to(["read"]),
  //   allow.group("ATHLETE").to(["read"])
  // ]),
  // Measure: a.model({
  //   measureId: a.id().required(),
  //   workoutPartTemplateScoreId: a.id().required(),
  //   type: a.string().required(),
  //   unit: a.string().required(),
  //   workoutPartTemplateScore: a.belongsTo('WorkoutPartTemplateScore', 'workoutPartTemplateScoreId'),
  //   measureValue: a.hasOne('MeasureValue', 'measureId')
  // }).authorization(allow => [
  //   allow.group("ADMIN"),
  //   allow.group("COACH").to(["read"]),
  //   allow.group("ATHLETE").to(["read"])
  // ]),
  // MeasureValue: a.model({
  //   measureValueId: a.id().required(),
  //   measureId: a.id().required(),
  //   amount: a.float(),
  //   measure: a.belongsTo('Measure', 'measureId')
  // }).authorization(allow => [
  //   allow.group("ADMIN"),
  //   allow.group("COACH"),
  //   allow.group("ATHLETE").to(["read"])
  // ])
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