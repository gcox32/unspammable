"use client";

import AuthProtected from "@/src/components/AuthProtected";

export default function Profile() {
  return (
    <AuthProtected>
      {(user) => (
        <main>
          <h1>Profile</h1>
          <p>Welcome, {user.username}</p>
        </main>
      )}
    </AuthProtected>
  );
} 