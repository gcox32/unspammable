"use client";

import AuthProtected from "@/src/components/auth/AuthProtected";

export default function MetricsPage() {

  return (
    <AuthProtected>
      {(user) => (
        <div className="metrics-page content">
          <h1>Metrics</h1>
        <div className="metrics-content">
          <div className="welcome-section">
            <h2>Performance Metrics</h2>
            <p>View and analyze your athletic performance metrics.</p>
          </div>

          <div className="metrics-section">
            <h3>Your Metrics</h3>
            {/* Add metrics display here */}
          </div>
        </div>
        </div>
      )}
    </AuthProtected>
  );
} 