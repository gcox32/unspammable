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
  // @ts-ignore
  const chartData = workoutLogs.map(log => ({date: log.date,score: log.outputScore,workoutName: log.workout.name
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
                `Score: ${value}`,
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