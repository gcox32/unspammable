import MetricCard from './MetricCard';
import type { MetricData } from '@/src/types/biometrics';
import LockIcon from '@/src/components/icons/LockIcon';

interface TelehealthMetricsProps {
  metrics: MetricData[];
  isLocked: boolean;
}

export default function TelehealthMetrics({ metrics, isLocked }: TelehealthMetricsProps) {
  if (isLocked) {
    return (
      <div className="telehealth-locked">
        <div className="lock-message">
          <LockIcon className="lock-icon" />
          <h3>Inception Telehealth Metrics Locked</h3>
          <p>Contact your coach to enable telehealth tracking.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="telehealth-metrics">
      <h2>Telehealth Metrics</h2>
      <div className="metrics-grid">
        <MetricCard
          title="Blood Pressure (Systolic)"
          entries={metrics.find(m => m.metric.type === 'blood_pressure_systolic')?.entries || []}
          valueLabel="mmHg"
          color="#8B5CF6"
        />
        <MetricCard
          title="Blood Pressure (Diastolic)"
          entries={metrics.find(m => m.metric.type === 'blood_pressure_diastolic')?.entries || []}
          valueLabel="mmHg"
          color="#6366F1"
        />
      </div>
    </div>
  );
} 