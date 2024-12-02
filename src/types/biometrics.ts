import type { TrackingMetric, TrackingMetricEntry } from './schema';

export interface MetricData {
  id: string;
  type: string;
  unit: string;
  entries: TrackingMetricEntry[];
} 