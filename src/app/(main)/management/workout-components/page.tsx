"use client";

import { useEffect, useState } from "react";
import AuthProtected from "@/src/components/auth/AuthProtected";
import type { Schema } from '@/amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import type { WorkoutComponentTemplate } from '@/src/types/schema';
import '@/src/styles/management.css';
import BrowsingContainer from '@/src/components/management/BrowsingContainer';
import CreateItemForm from "@/src/components/management/CreateItemForm";
import Snackbar from '@/src/components/Snackbar';
import type { SnackbarState } from '@/src/types/app';
import { COMPONENT_FIELDS } from '@/src/types/workout';

const client = generateClient<Schema>()

export default function WorkoutComponentsPage() {
  const [components, setComponents] = useState<WorkoutComponentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    show: false,
    message: ''
  });

  const fetchComponents = async () => {
    try {
      const { data: componentData } = await client.models.WorkoutComponentTemplate.list();
      
      // Fetch associated exercises for each component
      const componentsWithExercises = await Promise.all(
        componentData.map(async (component) => {
          const { data: exercisesData } = await client.models.WorkoutComponentTemplateExercise.list({
            filter: {
              workoutComponentTemplateId: { eq: component.id }
            }
          });
          
          return {
            ...component,
            exercises: exercisesData
          };
        })
      );

      // @ts-ignore
      setComponents(componentsWithExercises);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching workout components:', err);
      setError('Failed to load workout components');
      setLoading(false);
    }
  };

  const handleCreateComponent = async (formData: Record<string, any>) => {
    try {
      // Create the workout component template
      // @ts-ignore
      const { data: newComponent } = await client.models.WorkoutComponentTemplate.create({...formData, workoutTemplateId: 'temp', sequenceOrder: parseInt(formData.sequenceOrder)
      });

      // Update local state
      // @ts-ignore
      setComponents(prev => [...prev, { ...newComponent, exercises: [] }]);
      
      // Show success message
      setSnackbar({ show: true, message: 'Component created successfully' });
      setTimeout(() => {
        setSnackbar({ show: false, message: '' });
      }, 3000);
      
      return newComponent;
    } catch (error) {
      console.error('Error creating component:', error);
      throw new Error('Failed to create component');
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  return (
    <AuthProtected>
      {(user) => (
        <div className="management-page content">
          <div className="management-content">
            <div className="create-section">
              <h3>Create Component</h3>
              <p className="content-description">Manage the building blocks of your workouts.</p>
              <CreateItemForm
                fields={COMPONENT_FIELDS}
                // @ts-ignore
                onSubmit={handleCreateComponent}
                title="Create Component"
              />
              {snackbar.show && (
                <Snackbar 
                  message={snackbar.message}
                  type="success"
                  visible={snackbar.show}
                />
              )}
            </div>

            <div className="list-section">
              <h3>Available Components</h3>
              <p className="content-description">Browse and manage the component library.</p>
              <BrowsingContainer 
                // @ts-ignore
                items={components}
                loading={loading}
                error={error}
                renderItem={(component) => (
                  <div className="item-card">
                    <h4>{component.name}</h4>
                    <div className="component-exercises">
                      {component.exercises?.length > 0 && (
                        <span className="exercise-count">
                          {component.exercises.length} exercise{component.exercises.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                renderItemDetails={(component) => (
                  <div>Component Details Coming Soon</div>
                )}
                onItemUpdate={(updatedComponent) => {}}
              />
            </div>
          </div>
        </div>
      )}
    </AuthProtected>
  );
} 