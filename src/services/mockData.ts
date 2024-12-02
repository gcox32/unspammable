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

// Mock biometrics data
export const getMockBiometrics = () => {
  const metrics = [
    {
      id: 'weight-metric',
      type: 'Weight',
      unit: 'lbs',
      entries: Array.from({ length: 30 }, (_, i) => ({
        id: `weight-entry-${i}`,
        date: new Date(new Date().setDate(new Date().getDate() - i)),
        value: randomValue(170, 180)
      }))
    },
    {
      id: 'bodyfat-metric',
      type: 'Body Fat',
      unit: '%',
      entries: Array.from({ length: 30 }, (_, i) => ({
        id: `bodyfat-entry-${i}`,
        date: new Date(new Date().setDate(new Date().getDate() - i)),
        value: randomValue(12, 15)
      }))
    },
    {
      id: 'heartrate-metric',
      type: 'Resting Heart Rate',
      unit: 'bpm',
      entries: Array.from({ length: 30 }, (_, i) => ({
        id: `heartrate-entry-${i}`,
        date: new Date(new Date().setDate(new Date().getDate() - i)),
        value: randomValue(58, 65)
      }))
    }
  ];
  return metrics;
};

// Mock performance data
export const getMockPerformanceTrends = () => {
  const today = new Date();
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    return date;
  });

  return {
    totalWorkTrend: dates.map(date => ({
      date,
      value: randomValue(8000, 12000) // Total work in joules
    })),
    powerOutputTrend: dates.map(date => ({
      date,
      value: randomValue(200, 300) // Power in watts
    })),
    workoutDurationTrend: dates.map(date => ({
      date,
      value: randomValue(30, 60) // Duration in minutes
    }))
  };
};

// Mock workout volume data
export const getMockWorkoutVolume = () => {
  const today = new Date();
  
  return {
    daily: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(today.setDate(today.getDate() - 1)),
      count: randomValue(1, 3)
    })),
    weekly: Array.from({ length: 4 }, (_, i) => ({
      date: new Date(today.setDate(today.getDate() - 7)),
      count: randomValue(5, 10)
    })),
    monthly: Array.from({ length: 6 }, (_, i) => ({
      date: new Date(today.setMonth(today.getMonth() - 1)),
      count: randomValue(20, 30)
    }))
  };
};

// Mock max lifts and benchmarks data
export const getMockPerformanceMetrics = () => {
  const maxLifts = [
    {
      id: 'back-squat',
      type: 'back_squat_1rm',
      unit: 'kg',
      entries: Array.from({ length: 10 }, (_, i) => ({
        id: `back-squat-${i}`,
        date: new Date(new Date().setDate(new Date().getDate() - i * 14)),
        value: randomValue(100, 140),
        trackingMetricId: 'back-squat'
      }))
    },
    {
      id: 'deadlift',
      type: 'deadlift_1rm',
      unit: 'kg',
      entries: Array.from({ length: 10 }, (_, i) => ({
        id: `deadlift-${i}`,
        date: new Date(new Date().setDate(new Date().getDate() - i * 14)),
        value: randomValue(120, 160),
        trackingMetricId: 'deadlift'
      }))
    },
    {
      id: 'clean-and-jerk',
      type: 'clean_and_jerk',
      unit: 'kg',
      entries: Array.from({ length: 10 }, (_, i) => ({
        id: `clean-jerk-${i}`,
        date: new Date(new Date().setDate(new Date().getDate() - i * 14)),
        value: randomValue(70, 90),
        trackingMetricId: 'clean-and-jerk'
      }))
    },
    {
      id: 'snatch',
      type: 'snatch',
      unit: 'kg',
      entries: Array.from({ length: 10 }, (_, i) => ({
        id: `snatch-${i}`,
        date: new Date(new Date().setDate(new Date().getDate() - i * 14)),
        value: randomValue(50, 70),
        trackingMetricId: 'snatch'
      }))
    }
  ];

  const benchmarks = [
    {
      id: 'mile-time',
      type: 'mile_time',
      unit: 'min',
      entries: Array.from({ length: 10 }, (_, i) => ({
        id: `mile-${i}`,
        date: new Date(new Date().setDate(new Date().getDate() - i * 14)),
        value: randomValue(6, 8),
        trackingMetricId: 'mile-time'
      }))
    },
    {
      id: '2k-row',
      type: '2k_row',
      unit: 'min',
      entries: Array.from({ length: 10 }, (_, i) => ({
        id: `row-${i}`,
        date: new Date(new Date().setDate(new Date().getDate() - i * 14)),
        value: randomValue(7, 9),
        trackingMetricId: '2k-row'
      }))
    },
    {
      id: 'max-pullups',
      type: 'max_pullups',
      unit: 'reps',
      entries: Array.from({ length: 10 }, (_, i) => ({
        id: `pullups-${i}`,
        date: new Date(new Date().setDate(new Date().getDate() - i * 14)),
        value: randomValue(15, 25),
        trackingMetricId: 'max-pullups'
      }))
    }
  ];

  return [...maxLifts, ...benchmarks];
}; 