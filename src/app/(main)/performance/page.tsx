"use client";

import { useEffect, useState } from "react";
import AuthProtected from "@/src/components/auth/AuthProtected";
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { useAthlete } from '@/src/hooks/useAthlete';
import type { MetricData } from '@/src/types/biometrics';
import MaxLiftsSection from '@/src/components/performance/MaxLiftsSection';
import BenchmarksSection from '@/src/components/performance/BenchmarksSection';
import '@/src/styles/performance.css';

const client = generateClient<Schema>();

const PerformanceContent = ({ user }: { user: any }) => {
  const { athlete, loading: athleteLoading } = useAthlete(user?.username);
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!athlete?.id) return;
      
      try {
        setLoading(true);
        setError(null);

        const { data: trackingMetrics } = await client.models.TrackingMetric.list({
          filter: { athleteId: { eq: athlete.id } }
        });

        const metricsWithEntries = await Promise.all(
          trackingMetrics.map(async (metric) => {
            const { data: entries } = await client.models.TrackingMetricEntry.list({
              filter: { trackingMetricId: { eq: metric.id } },
              // @ts-ignore
              sort: { field: 'date', order: 'desc' }
            });

            return {
              metric,
              entries: entries.sort((a, b) => 
                new Date(a.date).getTime() - new Date(b.date).getTime()
              )
            };
          })
        );
        // @ts-ignore
        setMetrics(metricsWithEntries);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setError('Failed to load metrics data');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
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

  return (
    <div className="performance-page content">
      <h1>Performance Tracking</h1>
      <div className="performance-content">
        <MaxLiftsSection metrics={metrics} />
        <BenchmarksSection metrics={metrics} />
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