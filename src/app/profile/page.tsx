"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Profile() {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/sign-in?next=/profile');
    }
  }, [user, router]);

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <main>
      <h1>Profile</h1>
      <p>Welcome, {user.username}</p>
      {/* Add more profile content here */}
    </main>
  );
} 