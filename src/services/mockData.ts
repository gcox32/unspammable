import type { TrackingMetric, TrackingMetricEntry, WorkoutLog } from '@/src/types/schema';

// Toggle for using mock data
export const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Helper to generate random dates within a range
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper to generate random values within a range
const randomValue = (min: number, max: number) => {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
};

// Mock tracking metrics data
export const getMockTrackingMetrics = (): TrackingMetric[] => {
  const metrics = [
    {
      id: 'mock-weight',
      type: 'Weight',
      unit: 'kg',
      athleteId: 'mock-athlete',
      entries: Array.from({ length: 30 }, (_, i): TrackingMetricEntry => ({
        id: `mock-weight-entry-${i}`,
        date: randomDate(new Date('2024-01-01'), new Date()),
        value: randomValue(70, 75), // Weight between 70-75kg
        trackingMetricId: 'mock-weight'
      }))
    },
    {
      id: 'mock-sleep',
      type: 'Sleep',
      unit: 'hours',
      athleteId: 'mock-athlete',
      entries: Array.from({ length: 30 }, (_, i): TrackingMetricEntry => ({
        id: `mock-sleep-entry-${i}`,
        date: randomDate(new Date('2024-01-01'), new Date()),
        value: randomValue(6, 9), // Sleep between 6-9 hours
        trackingMetricId: 'mock-sleep'
      }))
    }
  ];

  // Sort entries by date
  metrics.forEach(metric => {
    metric.entries?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  return metrics;
};

// Mock workout logs data
export const getMockWorkoutLogs = (): WorkoutLog[] => {
  return Array.from({ length: 20 }, (_, i): WorkoutLog => {
    const workoutInstanceId = `mock-instance-${i}`;
    const workoutTemplateId = `mock-template-${i}`;
    
    return {
      id: `mock-workout-${i}`,
      workoutInstanceId,
      athleteId: 'mock-athlete',
      completionDate: randomDate(new Date('2024-01-01'), new Date()),
      asPrescribed: Math.random() > 0.2, // 80% chance of being as prescribed
      // Mock the related workout instance and template
      workoutInstance: {
        id: workoutInstanceId,
        date: randomDate(new Date('2024-01-01'), new Date()),
        workoutTemplateId: workoutTemplateId,
        workoutTemplate: {
          id: workoutTemplateId,
          name: `Mock Workout ${i}`,
          description: `Description for mock workout ${i}`,
          workoutComponentTemplates: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
            id: `mock-component-${i}-${j}`,
            workoutTemplateId: workoutTemplateId,
            workoutComponentTemplateId: `mock-component-template-${i}-${j}`,
            workoutComponentTemplate: {
              id: `mock-component-template-${i}-${j}`,
              name: `Component ${j + 1}`,
              description: `Description for component ${j + 1}`,
              sequenceOrder: j + 1,
              workoutTemplateId: workoutTemplateId
            }
          }))
        }
      },
      // Mock performance metrics
      outputScore: {
        id: `mock-output-score-${i}`,
        workoutLogId: `mock-workout-${i}`,
        totalWork: randomValue(5000, 15000), // Work between 5000-15000 joules
        averagePower: randomValue(100, 300), // Power between 100-300 watts
        totalTime: randomValue(20, 60), // Duration between 20-60 minutes
      }
    };
  }).sort((a, b) => 
    new Date(b.completionDate!).getTime() - new Date(a.completionDate!).getTime()
  );
};

// Mock performance trends
export const getMockPerformanceTrends = () => {
  return {
    totalWorkTrend: Array.from({ length: 10 }, () => randomValue(5000, 15000)),
    powerOutputTrend: Array.from({ length: 10 }, () => randomValue(100, 300)),
    workoutDurationTrend: Array.from({ length: 10 }, () => randomValue(20, 60)),
    workoutScoreTrend: Array.from({ length: 10 }, () => randomValue(80, 100))
  };
};

// Mock workout volume data
export const getMockWorkoutVolume = () => {
  return {
    daily: Array.from({ length: 7 }, () => randomValue(0, 100)),
    weekly: Array.from({ length: 4 }, () => randomValue(200, 500)),
    monthly: Array.from({ length: 12 }, () => randomValue(800, 2000))
  };
}; 