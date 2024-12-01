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

interface MetricCardProps {
  title: string;
  entries: TrackingMetricEntry[];
  valueLabel: string;
  color: string;
}

export default function MetricCard({ title, entries, valueLabel, color }: MetricCardProps) {
  return (
    <div className="metric-card">
      <h3>{title}</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
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
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 