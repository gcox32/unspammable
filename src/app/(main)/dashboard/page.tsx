"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/sign-in?next=/dashboard');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <main className="dashboard-page">
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
    </main>
  );
} 