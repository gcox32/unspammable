import BenchmarkCard from './BenchmarkCard';
import type { MetricData } from '@/src/types/biometrics';

interface MaxLiftsSectionProps {
  metrics: MetricData[];
}

export default function MaxLiftsSection({ metrics }: MaxLiftsSectionProps) {
  return (
    <div className="max-lifts-section">
      <h2>Max Lifts</h2>
      <div className="metrics-grid">
        <BenchmarkCard
          title="Back Squat 1RM"
          entries={metrics.find(m => m.metric.type === 'back_squat_1rm')?.entries || []}
          valueLabel="kg"
          color="#4F46E5"
          description="One rep max back squat"
        />
        <BenchmarkCard
          title="Deadlift 1RM"
          entries={metrics.find(m => m.metric.type === 'deadlift_1rm')?.entries || []}
          valueLabel="kg"
          color="#DC2626"
          description="One rep max deadlift"
        />
        <BenchmarkCard
          title="Clean & Jerk"
          entries={metrics.find(m => m.metric.type === 'clean_and_jerk')?.entries || []}
          valueLabel="kg"
          color="#059669"
          description="One rep max clean and jerk"
        />
        <BenchmarkCard
          title="Snatch"
          entries={metrics.find(m => m.metric.type === 'snatch')?.entries || []}
          valueLabel="kg"
          color="#7C3AED"
          description="One rep max snatch"
        />
      </div>
    </div>
  );
} 