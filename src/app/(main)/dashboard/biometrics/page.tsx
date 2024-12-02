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
import { getBiometrics } from '@/src/services/dataService';

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

        const metricsData = await getBiometrics(athlete.id);
        console.log('Raw metrics data:', metricsData);
        
        setMetrics(metricsData as MetricData[]);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setError('Failed to load metrics data');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [athlete?.id]);

  useEffect(() => {
    console.log('Current metrics state:', metrics);
    metrics.forEach(m => {
      console.log(`Metric ${m.type}:`, {
        id: m.id,
        type: m.type,
        unit: m.unit,
        entriesCount: m.entries?.length || 0,
        // @ts-ignore 
        firstEntry: m.entries?.[0],
        // @ts-ignore
        lastEntry: m.entries?.[m.entries.length - 1]
      });
    });
  }, [metrics]);

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
      <div className="biometrics-content">
        <div className="metrics-grid">
          <MetricCard
            title="Body Weight"
            entries={metrics.find(m => m.type.toLowerCase() === 'weight')?.entries || []}
            valueLabel="kg"
            color="#4F46E5"
          />

          <MetricCard
            title="Body Fat Percentage"
            entries={metrics.find(m => m.type.toLowerCase() === 'body fat')?.entries || []}
            valueLabel="%"
            color="#EF4444"
          />

          <MetricCard
            title="Resting Heart Rate"
            entries={metrics.find(m => m.type.toLowerCase() === 'resting heart rate')?.entries || []}
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