"use client";

import { useEffect, useState } from "react";
import AuthProtected from "@/src/components/AuthProtected";
import type { Schema } from '@/amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import type { ExerciseTemplate } from '@/src/types/schema';
import '../../../styles/management.css';
import BrowsingContainer from '@/src/components/BrowsingContainer';
import CreateItemForm from "@/src/components/CreateItemForm";
import { EXERCISE_FIELDS } from '@/src/types/exercise';

const client = generateClient<Schema>()

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<ExerciseTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExercises() {
      try {
        const { data } = await client.models.ExerciseTemplate.list();
        // @ts-ignore
        setExercises(data as ExerciseTemplate[]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching exercises:', err);
        setError('Failed to load exercises');
        setLoading(false);
      }
    }

    fetchExercises();
  }, []);

  const handleCreateExercise = async (formData: Record<string, any>) => {
    try {
      const { outputConstants, ...exerciseData } = formData;
      
      // First create the exercise template
      // @ts-ignore
      const { data: newExercise } = await client.models.ExerciseTemplate.create({...exerciseData});

      // Then create the associated output constants
      if (outputConstants) {
        await client.models.ExerciseOutputConstants.create({
          // @ts-ignore
          ...outputConstants, exerciseTemplateId: newExercise.id
        });
      }

      // Update local state
      // @ts-ignore
      setExercises(prev => [...prev, newExercise]);
      
      return newExercise;
    } catch (error) {
      console.error('Error creating exercise:', error);
      throw new Error('Failed to create exercise');
    }
  };

  return (
    <AuthProtected>
      {(user) => (
        <div className="exercises-page content">
          <div className="exercises-content">
            {/* Left Section - Create Exercise */}
            <div className="create-section">
              <h3>Create Exercise</h3>
              <p className="content-description">Add a new exercise to your library.</p>
              <CreateItemForm
                // @ts-ignore
                fields={EXERCISE_FIELDS}
                // @ts-ignore
                onSubmit={handleCreateExercise}
                title="Create Exercise"
              />
            </div>

            {/* Right Section - Exercise Library */}
            <div className="list-section">
              <h3>Exercise Library</h3>
              <p className="content-description">Browse and manage your exercise collection.</p>
              <BrowsingContainer 
                items={exercises}
                loading={loading}
                error={error}
                renderItem={(exercise) => (
                  <div className="item-card">
                    <h4>{exercise.name}</h4>
                    {exercise.category && <span className="category-pill" data-category={exercise.category.toLowerCase()}>{exercise.category.toLowerCase()}</span>}
                  </div>
                )}
                renderItemDetails={(exercise) => (
                  <div className="list-exercise-details">
                    {exercise.description && <p>{exercise.description}</p>}
                    {exercise.category && (
                      <div className="detail-row">
                        <strong>Category:</strong> {exercise.category}
                      </div>
                    )}
                    {exercise.equipment && exercise.equipment.length > 0 && (
                      <div className="detail-row">
                        <strong>Equipment:</strong>
                        <div className="equipment-tags">
                          {exercise.equipment.map((item, index) => (
                            <span key={index} className="equipment-tag">{item}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {exercise.videoUrl && (
                      <div className="detail-row">
                        <a href={exercise.videoUrl} target="_blank" rel="noopener noreferrer" 
                           className="video-link">
                          Watch Demo Video
                        </a>
                      </div>
                    )}
                    {exercise.videoEmbed && (
                      <div className="detail-row video-embed custom-video-class" 
                           dangerouslySetInnerHTML={{ __html: exercise.videoEmbed }} 
                      />
                    )}
                    {exercise.outputConstants && (
                      <div className="detail-row">
                        <strong>Output Configuration:</strong>
                        <div className="output-constants">
                          {exercise.outputConstants.bodyweightFactor && (
                            <div>Bodyweight Factor: {exercise.outputConstants.bodyweightFactor}</div>
                          )}
                          {exercise.outputConstants.defaultDistance && (
                            <div>Default Distance: {exercise.outputConstants.defaultDistance}m</div>
                          )}
                          {exercise.outputConstants.armLengthFactor && (
                            <div>Arm Length Factor: {exercise.outputConstants.armLengthFactor}</div>
                          )}
                          {exercise.outputConstants.legLengthFactor && (
                            <div>Leg Length Factor: {exercise.outputConstants.legLengthFactor}</div>
                          )}
                          {exercise.outputConstants.useCalories && (
                            <div>Uses Calories for Work Calculation</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      )}
    </AuthProtected>
  );
} 