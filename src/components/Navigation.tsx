"use client";

import React, { useState, useEffect } from "react";
import { Hub } from "aws-amplify/utils";
import Link from "next/link";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter, usePathname } from "next/navigation";
import Logo from "@/src/components/Logo";
import Snackbar from "@/src/components/Snackbar";
import '@/src/styles/components/Navigation.css';

export default function Navigation() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const currentPath = usePathname();

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">("success");

  const handleSignIn = () => {
    router.push(`/auth/sign-in?next=${currentPath}`);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      setSnackbarMessage("Failed to sign out. Please try again.");
      setSnackbarType("error");
      setSnackbarVisible(true);
      setTimeout(() => setSnackbarVisible(false), 3000);
    }
  };

  useEffect(() => {
    const hubListenerCancelToken = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedOut":
          setSnackbarMessage("Signed out successfully.");
          setSnackbarType("success");
          setSnackbarVisible(true);
          setTimeout(() => setSnackbarVisible(false), 3000);
          break;
        default:
          console.log("Unhandled auth event: ", payload.event);
      }
    });

    return () => hubListenerCancelToken();
  }, []);

  return (
    <nav>
      <div className="nav-logo">
        <Link href="/">
          <Logo width={50} height={50} />
        </Link>
      </div>

      <input type="checkbox" id="menu-toggle" className="menu-toggle" />

      <label htmlFor="menu-toggle" className="hamburger">
        <span className="hamburger-icon">&#9776;</span>
      </label>

      <ul className="nav-links">
        {user ? (
          <>
            <li><Link href="/profile">Profile</Link></li>
            <li>
              <button className="nav-button" onClick={handleSignOut}>Sign Out</button>
            </li>
          </>
        ) : (
          <li>
            <button className="nav-button" onClick={handleSignIn}>Sign In</button>
          </li>
        )}
      </ul>

      <Snackbar message={snackbarMessage} type={snackbarType} visible={snackbarVisible} />
    </nav>
  );
}