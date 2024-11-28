"use client";

import AuthProtected from "@/src/components/auth/AuthProtected";

export default function WorkoutsPage() {

  return (
    <AuthProtected>
      {(user) => (
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
      )}
    </AuthProtected>
  );
} 