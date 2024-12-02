import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { 
  useMockData, 
  getMockTrackingMetrics, 
  getMockWorkoutLogs,
  getMockPerformanceTrends,
  getMockWorkoutVolume 
} from './mockData';

const client = generateClient<Schema>();

export const getTrackingMetrics = async (athleteId: string) => {
  if (useMockData) {
    const mockMetrics = getMockTrackingMetrics();
    return mockMetrics.map(m => ({
      metric: {
        id: m.id,
        type: m.type.toLowerCase(),
        unit: m.unit
      },
      entries: m.entries || []
    }));
  }

  try {
    const { data: metrics } = await client.models.TrackingMetric.list({
      filter: { athleteId: { eq: athleteId } }
    });

    // Fetch entries for each metric
    const metricsWithEntries = await Promise.all(
      metrics.map(async (metric) => {
        const { data: entries } = await client.models.TrackingMetricEntry.list({
          filter: { trackingMetricId: { eq: metric.id } }
        });
        return {
          metric: {
            id: metric.id,
            type: metric.type.toLowerCase(),
            unit: metric.unit
          },
          entries: entries.sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          )
        };
      })
    );

    return metricsWithEntries;
  } catch (error) {
    console.error('Error fetching tracking metrics:', error);
    throw error;
  }
};

export const getWorkoutLogs = async (athleteId: string) => {
  if (useMockData) {
    return getMockWorkoutLogs();
  }

  try {
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
  } catch (error) {
    console.error('Error fetching workout logs:', error);
    throw error;
  }
};

export const getPerformanceTrends = async (athleteId: string) => {
  if (useMockData) {
    return getMockPerformanceTrends();
  }

  // Implement real performance trends calculation here
  // This would typically involve aggregating and analyzing workout log data
  try {
    const logs = await getWorkoutLogs(athleteId);
    // Add your real performance trend calculations here
    return {
      totalWorkTrend: [],
      powerOutputTrend: [],
      workoutDurationTrend: [],
      workoutScoreTrend: []
    };
  } catch (error) {
    console.error('Error calculating performance trends:', error);
    throw error;
  }
};

export const getWorkoutVolume = async (athleteId: string) => {
  if (useMockData) {
    return getMockWorkoutVolume();
  }

  // Implement real workout volume calculation here
  // This would typically involve aggregating workout log data by time periods
  try {
    const logs = await getWorkoutLogs(athleteId);
    // Add your real volume calculations here
    return {
      daily: [],
      weekly: [],
      monthly: []
    };
  } catch (error) {
    console.error('Error calculating workout volume:', error);
    throw error;
  }
}; 