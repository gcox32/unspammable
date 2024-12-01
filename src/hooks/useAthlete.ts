import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import type { Athlete } from '@/src/types/schema';

const client = generateClient<Schema>();

export function useAthlete(username: string | undefined) {
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAthlete = async () => {
      if (username) {
        try {
          const { data: athletes } = await client.models.Athlete.list({
            filter: { sub: { eq: username } }
          });
          
          if (athletes && athletes.length > 0) {
            // @ts-ignore
            setAthlete(athletes[0]);
          }
        } catch (error) {
          console.error('Error fetching athlete:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAthlete();

    const handleAthleteUpdate = () => {
      fetchAthlete();
    };

    window.addEventListener('athlete-updated', handleAthleteUpdate);

    return () => {
      window.removeEventListener('athlete-updated', handleAthleteUpdate);
    };
  }, [username]);

  return { athlete, loading };
} 