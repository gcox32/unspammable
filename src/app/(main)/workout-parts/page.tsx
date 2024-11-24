"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WorkoutPartsPage() {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/sign-in?next=/workout-parts');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="workout-parts-page content">
      <h1>Workout Parts</h1>
      <div className="workout-parts-content">
        <div className="welcome-section">
          <h2>Workout Components</h2>
          <p>Manage the building blocks of your workouts.</p>
        </div>
        
        <div className="workout-parts-section">
          <h3>Available Parts</h3>
          {/* Add workout parts management here */}
        </div>
      </div>
    </div>
  );
} 