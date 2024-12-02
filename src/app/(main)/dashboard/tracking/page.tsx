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
import { getTracking } from '@/src/services/dataService';

const client = generateClient<Schema>();

interface TrackingData {
  workoutLogs: WorkoutLog[];
  workoutVolume: {
    daily: { date: Date; count: number }[];
    weekly: { date: Date; count: number }[];
    monthly: { date: Date; count: number }[];
  };
}

const TrackingContent = ({ user }: { user: any }) => {
  const { athlete, loading: athleteLoading } = useAthlete(user?.username);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!athlete?.id) return;
      
      try {
        setLoading(true);
        setError(null);

        const data = await getTracking(athlete.id);
        setTrackingData(data as TrackingData);
      } catch (error) {
        console.error('Error fetching tracking data:', error);
        setError('Failed to load tracking data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  if (!trackingData) return null;

  return (
    <div className="tracking-page content">
      <h1>Output Tracking</h1>
      <div className="tracking-content">
        <section className="score-overview">
          <OutputScoreChart workoutLogs={trackingData.workoutLogs} />
        </section>

        <section className="recent-workouts">
          <h2>Recent Workouts</h2>
          <div className="workouts-grid">
            {trackingData.workoutLogs.slice(0, 6).map((log) => (
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
                {trackingData.workoutLogs.length > 0
                  ? (trackingData.workoutLogs.reduce((acc, log) => {
                      const work = log.outputScore?.totalWork;
                      return acc + (typeof work === 'number' ? work : 0);
                    }, 0) / trackingData.workoutLogs.length).toFixed(2)
                  : 'N/A'}
              </p>
            </div>
            <div className="insight-card">
              <h3>Highest Output Score</h3>
              <p className="insight-value">
                {trackingData.workoutLogs.length > 0
                  ? Math.max(...trackingData.workoutLogs.map(log => {
                      const work = log.outputScore?.totalWork;
                      return typeof work === 'number' ? work : 0;
                    }))
                  : 'N/A'}
              </p>
            </div>
            <div className="insight-card">
              <h3>Total Workouts</h3>
              <p className="insight-value">{trackingData.workoutLogs.length}</p>
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