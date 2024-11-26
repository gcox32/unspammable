"use client";

import AuthProtected from "@/src/components/AuthProtected";

export default function DashboardPage() {
  return (
    <AuthProtected>
      {(user) => (
        <div className="dashboard-page content">
          <h1>Dashboard</h1>
          <div className="dashboard-content">
            <div className="welcome-section">
              <h2>Welcome, {user.username}</h2>
              <p>Track your athletic performance and view your progress over time.</p>
            </div>
            
            <div className="stats-section">
              <h3>Your Stats</h3>
              {/* Add dashboard stats here */}
            </div>
          </div>
        </div>
      )}
    </AuthProtected>
  );
} 