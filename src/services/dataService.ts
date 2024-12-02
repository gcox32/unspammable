import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { 
  useMockData, 
  getMockBiometrics,
  getMockWorkoutLogs,
  getMockPerformanceTrends,
  getMockWorkoutVolume,
  getMockPerformanceMetrics
} from './mockData';

const client = generateClient<Schema>();

// Biometrics Dashboard
export const getBiometrics = async (athleteId: string) => {
  if (useMockData) {
    return getMockBiometrics();
  }

  try {
    const metricTypes = ['Weight', 'Body Fat', 'Resting Heart Rate'];
    const metricsPromises = metricTypes.map(async (type) => {
      const { data: metrics } = await client.models.TrackingMetric.list({
        filter: { 
          athleteId: { eq: athleteId },
          type: { eq: type }
        }
      });
      return metrics[0]; // Get the first metric of each type
    });

    const metrics = (await Promise.all(metricsPromises)).filter(Boolean);

    // Fetch entries for each metric
    const metricsWithEntries = await Promise.all(
      metrics.map(async (metric) => {
        const { data: entries } = await client.models.TrackingMetricEntry.list({
          filter: { trackingMetricId: { eq: metric.id } }
        });

        // Transform entries to ensure dates are Date objects
        const transformedEntries = entries.map(entry => ({
          ...entry,
          date: new Date(entry.date)
        }));

        return {
          id: metric.id,
          type: metric.type,
          unit: metric.unit,
          entries: transformedEntries.sort((a, b) => 
            a.date.getTime() - b.date.getTime()
          )
        };
      })
    );

    return metricsWithEntries;
  } catch (error) {
    console.error('Error fetching biometrics:', error);
    throw error;
  }
};

// Performance Dashboard
export const getPerformance = async (athleteId: string) => {
  if (useMockData) {
    const trends = getMockPerformanceTrends();
    const metrics = getMockPerformanceMetrics();
    return {
      ...trends,
      metrics
    };
  }

  try {
    console.log('athleteId', athleteId);
    const logs = await getWorkoutLogs(athleteId);
    console.log('logs', logs);
    // Process logs to create trend data
    const processedLogs = await Promise.all(logs.map(async (log) => {
      if (!log.completionDate) return null;
      
      const outputScoreResult = await log.outputScore();
      const outputScore = outputScoreResult.data;
      const date = new Date(log.completionDate);
      
      return {
        date,
        totalWork: outputScore?.totalWork || 0,
        averagePower: outputScore?.averagePower || 0,
        totalTime: outputScore?.totalTime || 0
      };
    }));

    const validLogs = processedLogs.filter((log): log is NonNullable<typeof log> => log !== null);

    const trends = {
      totalWorkTrend: validLogs.map(log => ({ date: log.date, value: log.totalWork })),
      powerOutputTrend: validLogs.map(log => ({ date: log.date, value: log.averagePower })),
      workoutDurationTrend: validLogs.map(log => ({ date: log.date, value: log.totalTime })),
    };

    // Sort trends by date
    (Object.keys(trends) as Array<keyof typeof trends>).forEach(key => {
      trends[key].sort((a, b) => a.date.getTime() - b.date.getTime());
    });

    // Fetch performance metrics
    const metricTypes = [
      'back_squat_1rm', 'deadlift_1rm', 'clean_and_jerk', 'snatch',
      'mile_time', '2k_row', 'max_pullups'
    ];

    const metricsPromises = metricTypes.map(type => 
      client.models.TrackingMetric.list({
        filter: { 
          athleteId: { eq: athleteId },
          type: { eq: type }
        }
      })
    );

    const metricsResponses = await Promise.all(metricsPromises);
    const metrics = metricsResponses.flatMap(response => response.data);

    // Fetch entries for each metric
    const metricsWithEntries = await Promise.all(
      metrics.map(async (metric) => {
        const { data: entries } = await client.models.TrackingMetricEntry.list({
          filter: { trackingMetricId: { eq: metric.id } }
        });

        return {
          id: metric.id,
          type: metric.type,
          unit: metric.unit,
          entries: entries.map(entry => ({
            ...entry,
            date: new Date(entry.date)
          })).sort((a, b) => a.date.getTime() - b.date.getTime())
        };
      })
    );

    return {
      ...trends,
      metrics: metricsWithEntries
    };
  } catch (error) {
    console.error('Error calculating performance trends:', error);
    throw error;
  }
};

// Helper function to calculate workout score (placeholder implementation)
const calculateWorkoutScore = (log: any) => {
  if (!log.outputScore) return 0;
  
  // Simple scoring based on total work and time
  const work = log.outputScore.totalWork || 0;
  const time = log.outputScore.totalTime || 1; // Avoid division by zero
  return Math.round((work / time) * 10) / 10;
};

// Output Tracking Dashboard
export const getTracking = async (athleteId: string) => {
  if (useMockData) {
    const logs = getMockWorkoutLogs();
    const volume = getMockWorkoutVolume();
    return {
      workoutLogs: logs,
      workoutVolume: volume
    };
  }

  try {
    const logs = await getWorkoutLogs(athleteId);
    const volume = {
      daily: [],
      weekly: [],
      monthly: []
    };

    return {
      workoutLogs: logs,
      workoutVolume: volume
    };
  } catch (error) {
    console.error('Error fetching tracking data:', error);
    throw error;
  }
};

// Helper function for fetching workout logs
const getWorkoutLogs = async (athleteId: string) => {
  const { data: logs } = await client.models.WorkoutLog.list({
    filter: { athleteId: { eq: athleteId } }
  });

  // Fetch workout instances
  const logsWithInstances = await Promise.all(
    logs.map(async (log) => {
      const { data: instance } = await client.models.WorkoutInstance.get({ id: log.workoutInstanceId });
      const { data: template } = instance ? 
        await client.models.WorkoutTemplate.get({ id: instance.workoutTemplateId }) : 
        { data: null };
      return {
        ...log,
        completionDate: log.completionDate ? new Date(log.completionDate) : null,
        workoutInstance: instance ? {
          ...instance,
          workoutTemplate: template
        } : null
      };
    })
  );

  return logsWithInstances.sort((a, b) => 
    new Date(b.completionDate!).getTime() - new Date(a.completionDate!).getTime()
  );
}; 