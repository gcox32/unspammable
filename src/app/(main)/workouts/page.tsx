"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WorkoutsPage() {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/sign-in?next=/workouts');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="workouts-page content">
      <h1>Workouts</h1>
      <div className="workouts-content">
        <div className="welcome-section">
          <h2>Workout Management</h2>
          <p>Create and manage your workout programs.</p>
        </div>
        
        <div className="workouts-section">
          <h3>Your Workouts</h3>
          {/* Add workouts list/management here */}
        </div>
      </div>
    </div>
  );
} 