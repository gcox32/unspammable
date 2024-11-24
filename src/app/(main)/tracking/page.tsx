"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TrackingPage() {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/sign-in?next=/tracking');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
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
  );
} 