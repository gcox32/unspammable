"use client";

import AuthProtected from "@/src/components/auth/AuthProtected";

export default function WorkoutPartsPage() {
  return (
    <AuthProtected>
      {(user) => (
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
      )}
    </AuthProtected>
  );
} 