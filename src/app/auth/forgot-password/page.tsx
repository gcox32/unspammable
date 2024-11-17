"use client";

import React, { useEffect } from "react";
import { Hub } from "aws-amplify/utils";
import { Authenticator } from "@aws-amplify/ui-react";
import { useRouter, useSearchParams } from "next/navigation";
import "@aws-amplify/ui-react/styles.css";
import { useAuthRedirect } from "@/src/hooks/useAuthRedirect";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/auth/sign-in';
  useAuthRedirect(nextUrl);

  useEffect(() => {
    const hubListenerCancelToken = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signInWithRedirect":
          console.log("Password reset initiated");
          break;
        case "signedIn":
          console.log("New password submitted successfully");
          router.push(nextUrl);
          break;
        case "signInWithRedirect_failure":
          console.log("Failed to reset password or submit new password");
          break;
        default:
          console.log("Unhandled auth event: ", payload);
      }
    });

    return () => hubListenerCancelToken();
  }, [router, searchParams]);

  return (
    <main className="auth-page">
      <Authenticator initialState="forgotPassword" />
    </main>
  );
}