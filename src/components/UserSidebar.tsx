import React from 'react';
import Link from 'next/link';
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";

export default function UserSidebar({ user }: { user: any }) {
  const { signOut } = useAuthenticator((context) => [context.user]);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="user-sidebar">
      <div className="user-info">
        <div className="user-avatar" 
          style={{
            backgroundImage: `url('https://ui-avatars.com/api/?name=${user?.username}&background=random')`
          }}
        />
        <h2>{user?.username}</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li><Link href="/profile">Profile</Link></li>
          <li><Link href="/dashboard">Dashboard</Link></li>
        </ul>
      </nav>
      <div className="logout-container">
        <button onClick={handleSignOut} className="logout-button">Sign Out</button>
      </div>
    </div>
  );
} 