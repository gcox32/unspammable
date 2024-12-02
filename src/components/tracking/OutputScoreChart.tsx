import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { WorkoutLog } from '@/src/types/schema';

interface OutputScoreChartProps {
  workoutLogs: WorkoutLog[];
}

export default function OutputScoreChart({ workoutLogs }: OutputScoreChartProps) {
  const chartData = workoutLogs
    .slice()
    .filter(log => log.completionDate !== null)
    .sort((a, b) => new Date(a.completionDate!).getTime() - new Date(b.completionDate!).getTime())
    .map(log => ({
      date: log.completionDate,
      score: log.outputScore?.totalWork || 0,
      workoutName: log.workoutInstance?.workoutTemplate?.name || 'Unknown'
    }));

  return (
    <div className="output-score-chart">
      <h2>Output Score Progression</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(date) => new Date(date).toLocaleDateString()}
              formatter={(value, name, props) => [
                `Total Work: ${value} joules`,
                `Workout: ${props.payload.workoutName}`
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#3B82F6"
              dot={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 