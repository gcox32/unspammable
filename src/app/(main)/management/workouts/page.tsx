"use client";

import { useEffect, useState } from "react";
import AuthProtected from "@/src/components/auth/AuthProtected";
import type { Schema } from '@/amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import type { ExerciseTemplate } from '@/src/types/schema';
import '@/src/styles/management.css';
import BrowsingContainer from '@/src/components/management/BrowsingContainer';
import CreateItemForm from "@/src/components/management/CreateItemForm";
import { EXERCISE_FIELDS } from '@/src/types/exercise';
import ExerciseDetails from '@/src/components/management/exercises/ExerciseDetails';
import Snackbar from '@/src/components/Snackbar';
import type { SnackbarState } from '@/src/types/app';

const client = generateClient<Schema>()

export default function WorkoutsPage() {
  return (
    <AuthProtected>
      {(user) => (
        <div className="management-page content">
          <div className="management-content">
            <div className="create-section">
              <h3>Create Workout</h3>
              <p className="content-description">Manage workouts.</p>
            </div>

            <div className="list-section">
              <h3>Available Workouts</h3>
              <p className="content-description">Browse and manage the workout library.</p>

            </div>
          </div>
        </div>
      )}
    </AuthProtected>
  );
} 