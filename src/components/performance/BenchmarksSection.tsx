import BenchmarkCard from './BenchmarkCard';
import type { MetricData } from '@/src/types/biometrics';

interface BenchmarksSectionProps {
  metrics: MetricData[];
}

export default function BenchmarksSection({ metrics }: BenchmarksSectionProps) {
  return (
    <div className="benchmarks-section">
      <h2>Benchmarks</h2>
      <div className="metrics-grid">
        <BenchmarkCard
          title="Mile Time"
          entries={metrics.find(m => m.metric.type === 'mile_time')?.entries || []}
          valueLabel="min"
          color="#2563EB"
          description="Time to complete one mile run"
        />
        <BenchmarkCard
          title="2000m Row"
          entries={metrics.find(m => m.metric.type === '2k_row')?.entries || []}
          valueLabel="min"
          color="#9333EA"
          description="Time to complete 2000m row"
        />
        <BenchmarkCard
          title="Max Pull-ups"
          entries={metrics.find(m => m.metric.type === 'max_pullups')?.entries || []}
          valueLabel="reps"
          color="#EA580C"
          description="Maximum consecutive strict pull-ups"
        />
      </div>
    </div>
  );
} 