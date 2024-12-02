"use client";

import { useEffect, useState } from "react";
import AuthProtected from "@/src/components/auth/AuthProtected";
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { useAthlete } from '@/src/hooks/useAthlete';
import MaxLiftsSection from '@/src/components/performance/MaxLiftsSection';
import BenchmarksSection from '@/src/components/performance/BenchmarksSection';
import '@/src/styles/performance.css';
import { getPerformance } from '@/src/services/dataService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const client = generateClient<Schema>();

interface PerformanceData {
  totalWorkTrend: { date: Date; value: number }[];
  powerOutputTrend: { date: Date; value: number }[];
  workoutDurationTrend: { date: Date; value: number }[];
  workoutScoreTrend: { date: Date; value: number }[];
  metrics: MetricData[];
}

const PerformanceContent = ({ user }: { user: any }) => {
  const { athlete, loading: athleteLoading } = useAthlete(user?.username);
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!athlete?.id) return;
      
      try {
        setLoading(true);
        setError(null);

        const data = await getPerformance(athlete.id);
        setPerformanceData(data);
      } catch (error) {
        console.error('Error fetching performance data:', error);
        setError('Failed to load performance data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [athlete?.id]);

  if (athleteLoading || loading) {
    return (
      <div className="loading-state">
        <p>Loading performance data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Error loading performance data: {error}</p>
      </div>
    );
  }

  if (!performanceData) return null;

  return (
    <div className="performance-page content">
      <h1>Performance Tracking</h1>
      <div className="performance-content">
        <section className="trends-section">
          <h2>Performance Trends</h2>
          <div className="trends-grid">
            <div className="trend-card">
              <h3>Total Work Output</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={performanceData.totalWorkTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    formatter={(value) => [`${value} joules`, 'Total Work']}
                  />
                  <Line type="monotone" dataKey="value" stroke="#4F46E5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="trend-card">
              <h3>Average Power Output</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={performanceData.powerOutputTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    formatter={(value) => [`${value} watts`, 'Power Output']}
                  />
                  <Line type="monotone" dataKey="value" stroke="#EF4444" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="trend-card">
              <h3>Workout Duration</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={performanceData.workoutDurationTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    formatter={(value) => [`${Math.round(Number(value) / 60)} min`, 'Duration']}
                  />
                  <Line type="monotone" dataKey="value" stroke="#10B981" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="trend-card">
              <h3>Workout Score</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={performanceData.workoutScoreTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    formatter={(value) => [`${value}`, 'Score']}
                  />
                  <Line type="monotone" dataKey="value" stroke="#8B5CF6" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
        
        <MaxLiftsSection metrics={performanceData.metrics} />
        <BenchmarksSection metrics={performanceData.metrics} />
      </div>
    </div>
  );
};

export default function PerformancePage() {
  return (
    <AuthProtected>
      {(user) => <PerformanceContent user={user} />}
    </AuthProtected>
  );
} 