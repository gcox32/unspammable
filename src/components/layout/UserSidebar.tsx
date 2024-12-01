import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { useAthlete } from '@/src/hooks/useAthlete';

const client = generateClient<Schema>();

export default function UserSidebar({ user }: { user: any }) {
  const { signOut } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const { athlete, loading } = useAthlete(user?.username);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    // Add timezone offset to handle date correctly
    const localDate = new Date(date);
    localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset());
    return localDate.toLocaleDateString();
  };

  return (
    <div className="user-sidebar">
      <div className="user-info">
        <div className="user-avatar" 
          style={{
            backgroundImage: `url('${athlete?.avatarUrl || `https://ui-avatars.com/api/?name=${athlete?.firstName} ${athlete?.lastName}&background=random`}')`
          }}
        />
        <h2>{athlete?.firstName} {athlete?.lastName}</h2>
        {athlete && (
          <div className="user-profile-info">
            {athlete.homeGym && (
              <p className="home-gym">{athlete.homeGym}</p>
            )}
            {athlete.gender && (
              <p className="profile-detail">
                <span className="label">Gender:</span> {athlete.gender}
              </p>
            )}
            {athlete.birthdate && (
              <p className="profile-detail">
                <span className="label">Birthdate:</span> {formatDate(athlete.birthdate)}
              </p>
            )}
            {athlete.height && (
              <p className="profile-detail">
                <span className="label">Height:</span> {athlete.height} in
              </p>
            )}
            {athlete.weight && (
              <p className="profile-detail">
                <span className="label">Weight:</span> {athlete.weight} lbs
              </p>
            )}
          </div>
        )}
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li><Link href="/profile">Edit Profile</Link></li>
          <li><Link href="/dashboard/biometrics">Dashboard</Link></li>
          <li><Link href="/dashboard/performance">Performance</Link></li>
          <li><Link href="/dashboard/tracking">Output Tracking</Link></li>
        </ul>
      </nav>
      <div className="logout-container">
        <button onClick={handleSignOut} className="logout-button">Sign Out</button>
      </div>
    </div>
  );
} 