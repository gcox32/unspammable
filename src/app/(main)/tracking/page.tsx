"use client";

import { useEffect, useState } from "react";
import AuthProtected from "@/src/components/auth/AuthProtected";
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { useAthlete } from '@/src/hooks/useAthlete';
import type { WorkoutLog } from '@/src/types/schema';
import OutputScoreChart from '@/src/components/tracking/OutputScoreChart';
import WorkoutBreakdown from '@/src/components/tracking/WorkoutBreakdown';
import '@/src/styles/tracking.css';

const client = generateClient<Schema>();

const TrackingContent = ({ user }: { user: any }) => {
  const { athlete, loading: athleteLoading } = useAthlete(user?.username);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkoutLogs = async () => {
      if (!athlete?.id) return;
      
      try {
        setLoading(true);
        setError(null);

        const { data: logs } = await client.models.WorkoutLog.list({
          filter: { athleteId: { eq: athlete.id } },
          // @ts-ignore
          sort: { field: 'date', order: 'desc' }
        });

        // @ts-ignore
        setWorkoutLogs(logs);
      } catch (error) {
        console.error('Error fetching workout logs:', error);
        setError('Failed to load workout data');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutLogs();
  }, [athlete?.id]);

  if (athleteLoading || loading) {
    return (
      <div className="loading-state">
        <p>Loading workout data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Error loading workout data: {error}</p>
      </div>
    );
  }

  return (
    <div className="tracking-page content">
      <h1>Output Tracking</h1>
      <div className="tracking-content">
        <section className="score-overview">
          <OutputScoreChart workoutLogs={workoutLogs} />
        </section>

        <section className="recent-workouts">
          <h2>Recent Workouts</h2>
          <div className="workouts-grid">
            {workoutLogs.slice(0, 6).map((log) => (
              <WorkoutBreakdown key={log.id} workoutLog={log} />
            ))}
          </div>
        </section>

        <section className="tracking-insights">
          <h2>Performance Insights</h2>
          <div className="insights-grid">
            <div className="insight-card">
              <h3>Average Output Score</h3>
              <p className="insight-value">
                {workoutLogs.length > 0
                  // @ts-ignore
                  ? (workoutLogs.reduce((acc, log) => acc + log.outputScore, 0) / workoutLogs.length).toFixed(2)
                  : 'N/A'}
              </p>
            </div>
            <div className="insight-card">
              <h3>Highest Output Score</h3>
              <p className="insight-value">
                {workoutLogs.length > 0
                  // @ts-ignore
                  ? Math.max(...workoutLogs.map(log => log.outputScore))
                  : 'N/A'}
              </p>
            </div>
            <div className="insight-card">
              <h3>Total Workouts</h3>
              <p className="insight-value">{workoutLogs.length}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default function TrackingPage() {
  return (
    <AuthProtected>
      {(user) => <TrackingContent user={user} />}
    </AuthProtected>
  );
} 