"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuthenticator, Authenticator } from "@aws-amplify/ui-react";
import { useRouter, usePathname } from "next/navigation";
import Logo from "@/src/components/Logo";
import '@/src/styles/components/Navigation.css';

export default function Navigation() {
  const { user, signOut } = useAuthenticator();
  const router = useRouter();
  const currentPath = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignIn = () => {
    // Redirect to sign-in and pass the current page as 'next'
    router.push(`/auth/sign-in?next=${currentPath}`);
  };

  return (
<nav>
  <div className="nav-logo">
    <Link href="/">
      <Logo width={40} height={40} color="lightblue" strokeColor="blue" />
    </Link>
  </div>

  {/* Hidden checkbox to control the menu */}
  <input type="checkbox" id="menu-toggle" className="menu-toggle" />

  {/* Label for hamburger icon */}
  <label htmlFor="menu-toggle" className="hamburger">
    <span className="hamburger-icon">&#9776;</span>
  </label>

  {/* Navigation links */}
  <ul className="nav-links">
    <li><Link href="/about">About</Link></li>
    <li><Link href="/contact">Contact</Link></li>
    {user ? (
      <li>
        <button className="nav-button" onClick={signOut}>Sign Out</button>
      </li>
    ) : (
      <li>
        <button className="nav-button" onClick={handleSignIn}>Sign In</button>
      </li>
    )}
  </ul>
</nav>
  );
}