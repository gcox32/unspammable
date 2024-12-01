"use client";

import { useEffect, useState } from "react";
import AuthProtected from "@/src/components/auth/AuthProtected";
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { useAthlete } from '@/src/hooks/useAthlete';
import type { MetricData } from '@/src/types/biometrics';
import MetricCard from '@/src/components/biometrics/MetricCard';
import '@/src/styles/biometrics.css';
import TelehealthMetrics from '@/src/components/biometrics/TelehealthMetrics';

const client = generateClient<Schema>();

const BiometricsContent = ({ user }: { user: any }) => {
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
        <p>Loading metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Error loading metrics: {error}</p>
      </div>
    );
  }

  return (
    <div className="biometrics-page content">
      <h1>Biometrics</h1>
      <div className="biometrics-content">
        <div className="metrics-grid">
          <MetricCard
            title="Body Weight"
            entries={metrics.find(m => m.metric.type === 'weight')?.entries || []}
            valueLabel="kg"
            color="#4F46E5"
          />

          <MetricCard
            title="Body Fat Percentage"
            entries={metrics.find(m => m.metric.type === 'body_fat_percentage')?.entries || []}
            valueLabel="%"
            color="#EF4444"
          />

          <MetricCard
            title="Resting Heart Rate"
            entries={metrics.find(m => m.metric.type === 'resting_heart_rate')?.entries || []}
            valueLabel="bpm"
            color="#10B981"
          />
        </div>

        <TelehealthMetrics 
          metrics={metrics}
          isLocked={!athlete?.accessTelehealth}
        />
      </div>
    </div>
  );
};

export default function BiometricsPage() {
  return (
    <AuthProtected>
      {(user) => <BiometricsContent user={user} />}
    </AuthProtected>
  );
} 