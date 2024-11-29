import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import type { Athlete } from '@/src/types/schema';

const client = generateClient<Schema>();

export default function UserSidebar({ user }: { user: any }) {
  const { signOut } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAthlete = async () => {
      if (user?.username) {
        try {
          const { data: athletes } = await client.models.Athlete.list({
            filter: { sub: { eq: user.username } }
          });
          
          if (athletes && athletes.length > 0) {
            const athleteWithProfile = await client.models.Athlete.get({
              id: athletes[0].id,
              // @ts-ignore
              include: ['profile']
            });
            // @ts-ignore
            setAthlete(athleteWithProfile.data);
          }
        } catch (error) {
          console.error('Error fetching athlete:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAthlete();
  }, [user?.username]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="user-sidebar">
      <div className="user-info">
        <div className="user-avatar" 
          style={{
            backgroundImage: `url('https://ui-avatars.com/api/?name=${athlete?.firstName} ${athlete?.lastName}&background=random')`
          }}
        />
        <h2>{athlete?.firstName} {athlete?.lastName}</h2>
        {athlete?.profile && (
          <div className="user-profile-info">
            {athlete.profile.homeGym && (
              <p className="home-gym">{athlete.profile.homeGym}</p>
            )}
          </div>
        )}
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li><Link href="/profile">Profile</Link></li>
          <li><Link href="/dashboard">Dashboard</Link></li>
        </ul>
      </nav>
      <div className="logout-container">
        <button onClick={handleSignOut} className="logout-button">Sign Out</button>
      </div>
    </div>
  );
} 