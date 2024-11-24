"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ExercisesPage() {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/sign-in?next=/exercises');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="exercises-page content">
      <h1>Exercises</h1>
      <div className="exercises-content">
        <div className="welcome-section">
          <h2>Exercise Library</h2>
          <p>Browse and manage your exercise collection.</p>
        </div>
        
        <div className="exercises-section">
          <h3>Available Exercises</h3>
          {/* Add exercises list/management here */}
        </div>
      </div>
    </div>
  );
} 