"use client";

import AuthProtected from "@/src/components/AuthProtected";

export default function Profile() {
  return (
    <AuthProtected>
      {(user) => (
        <div>
          <h1>Profile</h1>
          <p>Welcome, {user.username}</p>
        </div>
      )}
    </AuthProtected>
  );
} 