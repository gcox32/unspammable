"use client";

import React, { useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { FaCog } from "react-icons/fa";
import Sidebar from "./Sidebar";
import PageSettingsSidebar from "./PageSettingsSidebar";
import UserSidebar from "./UserSidebar";
import { useRouter } from "next/navigation";
import "../styles/components/Navigation.css";
import PersistentSidebar from './PersistentSidebar';
import { useSidebar } from "@/src/contexts/SidebarContext";

export default function Navigation() {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const [pageSettingsSidebarOpen, setPageSettingsSidebarOpen] = useState(false);
  const [userSidebarOpen, setUserSidebarOpen] = useState(false);
  const { isExpanded } = useSidebar();

  return (
    <>
      <PersistentSidebar />
      <nav className={`main-nav ${isExpanded ? 'sidebar-expanded' : ''}`}>
        <div className="nav-controls">
          {user ? (
            <>
              <button 
                className="icon-button" 
                aria-label="Settings"
                onClick={() => setPageSettingsSidebarOpen(true)}
              >
                <FaCog className="settings-icon" />
              </button>
              <button 
                className="avatar-button" 
                aria-label="User menu"
                onClick={() => setUserSidebarOpen(true)}
                style={{
                  backgroundImage: `url('https://ui-avatars.com/api/?name=${user.username}&background=random')`
                }}
              />
            </>
          ) : (
            <button className="nav-button" onClick={() => router.push('/auth/sign-in')}>
              Sign In
            </button>
          )}
        </div>
      </nav>

      <Sidebar 
        isOpen={pageSettingsSidebarOpen} 
        onClose={() => setPageSettingsSidebarOpen(false)}
        position="right"
      >
        <PageSettingsSidebar />
      </Sidebar>

      <Sidebar 
        isOpen={userSidebarOpen} 
        onClose={() => setUserSidebarOpen(false)}
        position="right"
      >
        <UserSidebar user={user} />
      </Sidebar>
    </>
  );
}