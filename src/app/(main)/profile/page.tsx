"use client";

import { useEffect, useState } from "react";
import AuthProtected from "@/src/components/auth/AuthProtected";
import type { Schema } from '@/amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import type { Athlete } from '@/src/types/schema';
import Snackbar from '@/src/components/Snackbar';
import type { SnackbarState } from '@/src/types/app';
import CreateItemForm from '@/src/components/management/CreateItemForm';
import '@/src/styles/profile.css';
import { useAthlete } from '@/src/hooks/useAthlete';

const client = generateClient<Schema>();

const ATHLETE_FIELDS = [
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text' as const,
    required: true,
  },
  {
    name: 'lastName',
    label: 'Last Name',
    type: 'text' as const,
    required: true,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email' as const,
    required: true,
  },
  {
    name: 'birthdate',
    label: 'Birthdate',
    type: 'date' as const,
  },
  {
    name: 'gender',
    label: 'Gender',
    type: 'select' as const,
    options: ['Male', 'Female'],
  },
  {
    name: 'height',
    label: 'Height (in)',
    type: 'number' as const,
  },
  {
    name: 'weight',
    label: 'Weight (lbs)',
    type: 'number' as const,
  },
  {
    name: 'homeGym',
    label: 'Home Gym',
    type: 'text' as const,
  },
  {
    name: 'avatarUrl',
    label: 'Avatar URL',
    type: 'text' as const,
  }
];

const ProfileContent = ({ user }: { user: any }) => {
  const { athlete, loading } = useAthlete(user?.username);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    show: false,
    message: '',
    type: 'error'
  });

  const handleUpdate = async (formData: Record<string, any>) => {
    try {
      if (!athlete?.id) return;

      const { data: updatedAthlete } = await client.models.Athlete.update({
        id: athlete.id,
        ...formData
      });

      const event = new CustomEvent('athlete-updated');
      window.dispatchEvent(event);

      setSnackbar({
        show: true,
        message: 'Profile updated successfully',
        type: 'success'
      });

      setTimeout(() => {
        setSnackbar(prev => ({ ...prev, show: false }));
      }, 3000);
    } catch (error) {
      console.error('Error updating athlete:', error);
      setSnackbar({
        show: true,
        message: 'Failed to update profile',
        type: 'error'
      });
    }
  };

  return (
    <div className="profile-page content">
      <div className="profile-content">
        <h3>Edit Profile</h3>
        {loading ? (
          <p>Loading...</p>
        ) : athlete ? (
          <div className="edit-form">
            <CreateItemForm
              // @ts-ignore
              fields={ATHLETE_FIELDS}
              onSubmit={handleUpdate}
              initialData={athlete}
              title="Update Profile"
            />
          </div>
        ) : (
          <p>No profile found.</p>
        )}
      </div>
      {snackbar.show && (
        <Snackbar 
          message={snackbar.message}
          // @ts-ignore
          type={snackbar.type}
          visible={snackbar.show}
        />
      )}
    </div>
  );
};

export default function Profile() {
  return (
    <AuthProtected>
      {(user) => <ProfileContent user={user} />}
    </AuthProtected>
  );
} 