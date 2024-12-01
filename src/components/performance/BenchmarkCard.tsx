import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { TrackingMetricEntry } from '@/src/types/schema';

interface BenchmarkCardProps {
  title: string;
  entries: TrackingMetricEntry[];
  valueLabel: string;
  color: string;
  description?: string;
}

export default function BenchmarkCard({ 
  title, 
  entries, 
  valueLabel, 
  color,
  description 
}: BenchmarkCardProps) {
  return (
    <div className="benchmark-card">
      <div className="benchmark-header">
        <h3>{title}</h3>
        {description && <p className="benchmark-description">{description}</p>}
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={entries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(date) => new Date(date).toLocaleDateString()}
              formatter={(value) => [`${value} ${valueLabel}`, title]}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              dot={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 