"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MetricsPage() {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/sign-in?next=/metrics');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
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
  );
} 