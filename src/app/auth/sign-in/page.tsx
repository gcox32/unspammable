"use client";

import React, { useEffect } from "react";
import { Hub } from "aws-amplify/utils";
import { Authenticator } from "@aws-amplify/ui-react";
import { useRouter, useSearchParams } from "next/navigation";
import "@aws-amplify/ui-react/styles.css";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const nextUrl = searchParams.get('next') || '/'; // Default to home page if 'next' is not provided

    // Set up a listener for authentication events
    const hubListenerCancelToken = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
          console.log("User has signed in successfully.");
          router.push(nextUrl); // Redirect to the 'next' URL or home page
          break;
        case "signedOut":
          console.log("User has signed out.");
          break;
        case "tokenRefresh":
          console.log("Auth tokens have been refreshed.");
          break;
        case "tokenRefresh_failure":
          console.log("Failed to refresh auth tokens.");
          break;
        case "signInWithRedirect":
          console.log("signInWithRedirect API has successfully resolved.");
          break;
        case "signInWithRedirect_failure":
          console.log("Failed to resolve signInWithRedirect API.");
          break;
        case "customOAuthState":
          console.log("Custom OAuth state returned from Cognito Hosted UI.");
          break;
        default:
          console.log("Unhandled auth event: ", payload);
      }
    });

    return () => hubListenerCancelToken();
  }, [router, searchParams]);

  return (
    <main className="auth-page">
      <Authenticator initialState="signIn" />
    </main>
  );
}