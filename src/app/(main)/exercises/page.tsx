"use client";

import AuthProtected from "@/src/components/AuthProtected";

export default function ExercisesPage() {
  return (
    <AuthProtected>
      {(user) => (
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
      )}
    </AuthProtected>
  );
} 