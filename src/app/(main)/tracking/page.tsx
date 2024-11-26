"use client";

import AuthProtected from "@/src/components/AuthProtected";

export default function TrackingPage() {
  return (
    <AuthProtected>
      {(user) => (
        <div className="tracking-page content">
          <h1>Tracking</h1>
          <div className="tracking-content">
            <div className="welcome-section">
              <h2>Activity Tracking</h2>
              <p>Track your workouts and athletic activities.</p>
            </div>

            <div className="tracking-section">
              <h3>Recent Activities</h3>
              {/* Add tracking interface here */}
            </div>
          </div>
        </div>
      )}
    </AuthProtected>
  );
} 