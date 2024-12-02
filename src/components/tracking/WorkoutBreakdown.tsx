import type { WorkoutLog } from '@/src/types/schema';

interface WorkoutBreakdownProps {
  workoutLog: WorkoutLog;
}

export default function WorkoutBreakdown({ workoutLog }: WorkoutBreakdownProps) {
  return (
    <div className="workout-breakdown">
      <div className="workout-header">
        {/* @ts-ignore */}
          <h3>{workoutLog.workoutInstance?.workoutTemplate?.name}</h3>
        <div className="score-badge">
          <span className="score-label">Output Score</span>
          {/* @ts-ignore */}
          {/* <span className="score-value">{workoutLog.outputScore}</span> */}
        </div>
      </div>
      <div className="breakdown-details">
        <div className="metric">
          <span className="label">Total Work</span>
          {/* @ts-ignore */}
          <span className="value">{workoutLog.outputScore?.totalWork} joules</span>
        </div>
        <div className="metric">
          <span className="label">Power Output</span>
          {/* @ts-ignore */}
          <span className="value">{workoutLog.outputScore?.averagePower} watts</span>
        </div>
        <div className="metric">
          <span className="label">Duration</span>
          {/* @ts-ignore */}
          <span className="value">{workoutLog.outputScore?.totalTime} minutes</span>
        </div>
      </div>
    </div>
  );
} 

