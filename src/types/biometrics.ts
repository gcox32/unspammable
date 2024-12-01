import type { TrackingMetric, TrackingMetricEntry } from './schema';

export interface MetricData {
  metric: TrackingMetric;
  entries: TrackingMetricEntry[];
} 