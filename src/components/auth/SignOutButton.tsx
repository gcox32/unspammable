"use client";

import React from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const { signOut } = useAuthenticator();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/"); // Redirect to home page after sign-out
  };

  return <button onClick={handleSignOut}>Sign out</button>;
}
