"use client";

import React from "react";
import "@/src/styles/app.css";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="about-page content">
      <section className="hero">
        <h1>Output Score Calculation Framework</h1>
        <p>A quantitative approach to measuring athletic performance through physics-based metrics</p>
      </section>

      <section className="overview">
        <h2>Overview</h2>
        <p>
          The output score is a measure of the physical work and power exerted by
          an athlete during an exercise. It provides a quantitative way to evaluate
          performance by applying basic physics principles. This framework supports
          a wide range of exercises, including weightlifting, gymnastics
          movements, cardio activities, and stationary equipment metrics.
        </p>
      </section>

      <section className="physics">
        <h2>Physics Principles</h2>
        
        <div className="principle">
          <h3>Work</h3>
          <p>
            In physics, <strong>work</strong> is defined as the force applied to an object times
            the distance it moves in the direction of the force:
          </p>
          <div className="math-formula">
            W = F × d
          </div>
          <p>Where:</p>
          <ul>
            <li><em>W</em> = Work (measured in Joules)</li>
            <li><em>F</em> = Force applied (measured in Newtons, equivalent to weight in kilograms multiplied by gravity: F = weight × g)</li>
            <li><em>d</em> = Distance moved (measured in meters)</li>
          </ul>
        </div>

        <div className="principle">
          <h3>Acceleration Normalization</h3>
          <p>
            For movements with significant acceleration changes, the force calculation is normalized against standard gravity (g ≈ 9.81 m/s²):
          </p>
          <div className="math-formula">
            F = weight × (a / g)
          </div>
          <p>Where:</p>
          <ul>
            <li><em>F</em> = Normalized force</li>
            <li><em>a</em> = Movement-specific acceleration</li>
            <li><em>g</em> = Standard gravity (9.81 m/s²)</li>
          </ul>
          <p className="note">
            For most exercises where acceleration is close to gravity, this normalization factor approaches 1, simplifying to F = weight.
          </p>
        </div>

        <div className="principle">
          <h3>Power</h3>
          <p>
            <strong>Power</strong> is the rate at which work is performed:
          </p>
          <div className="math-formula">
            P = W / t
          </div>
          <p>Where:</p>
          <ul>
            <li><em>P</em> = Power (measured in Watts)</li>
            <li><em>W</em> = Work (measured in Joules)</li>
            <li><em>t</em> = Time taken (measured in seconds)</li>
          </ul>
        </div>
      </section>

      <section className="approach">
        <h2>General Approach</h2>
        
        <div className="calculation-inputs">
          <h3>Inputs for Calculations</h3>
          <div className="input-group">
            <h4>1. Athlete Data</h4>
            <ul>
              <li>Bodyweight (used for bodyweight movements like push-ups and pull-ups)</li>
              <li>Optional anthropometric data (e.g., limb length for more precise distance calculations)</li>
            </ul>
          </div>
          
          <div className="input-group">
            <h4>2. Exercise-Specific Parameters</h4>
            <ul>
              <li>Weight (e.g., barbell or dumbbell load)</li>
              <li>Distance (e.g., depth of a squat or pull-up height)</li>
              <li>Repetitions</li>
            </ul>
          </div>
          
          <div className="input-group">
            <h4>3. Optional Time Data</h4>
            <ul>
              <li>Used to calculate power if available</li>
            </ul>
          </div>
        </div>

        <div className="calculation-steps">
          <h3>Steps in the Calculation</h3>
          <ol>
            <li>
              <strong>Determine Work:</strong>
              <div className="math-formula">
                W = F × d ×  reps
              </div>
              <p>Where:</p>
              <ul>
                <li><em>F</em> = weight</li>
                <li><em>d</em> = distance</li>
                <li>reps = number of repetitions</li>
              </ul>
            </li>
            <li>
              <strong>Determine Power:</strong>
              <p>If time (<em>t</em>) is available, compute:</p>
              <div className="math-formula">
                P = W / t
              </div>
            </li>
            <li>
              <strong>Account for Exercise-Specific Logic:</strong>
              <p>Use exercise-specific data and calculations (e.g., machine-reported calories for rowing or biking)</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="special-cases">
        <h2>Special Cases</h2>
        
        <div className="case">
          <h3>Bodyweight Exercises</h3>
          <p>For exercises like push-ups and pull-ups:</p>
          <ul>
            <li><strong>Force</strong> is derived from the athlete's bodyweight</li>
            <li><strong>Distance</strong> is based on the exercise movement (e.g., arm length for pull-ups or chest-to-floor distance for push-ups)</li>
          </ul>
        </div>

        <div className="case">
          <h3>Cardio Equipment</h3>
          <p>For stationary cardio machines like rowers and bikes:</p>
          <ul>
            <li>
              <strong>Calories</strong> reported by the machine are used as a proxy for work:
              <div className="math-formula">
                W =  calories × 4184
              </div>
              <p className="note">(1 calorie = ~4184 Joules)</p>
            </li>
            <li>Distance is treated as contextual rather than used in calculations</li>
          </ul>
        </div>
      </section>

      <section className="example">
        <h2>Example: Push-Up Calculation</h2>
        
        <div className="example-inputs">
          <h3>Inputs</h3>
          <ul>
            <li><strong>Athlete:</strong> Bodyweight: 70 kg</li>
            <li><strong>Measures:</strong>
              <ul>
                <li>Repetitions: 10</li>
                <li>Time: 30 seconds</li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="example-calculation">
          <h3>Calculation</h3>
          <div className="step">
            <h4>1. Work</h4>
            <div className="formula">
              <code>W = bodyweight × distance × reps</code>
            </div>
            <p>Assume a default distance of 0.5 meters:</p>
            <div className="formula">
              <code>W = 70 × 0.5 × 10 = 350 Joules</code>
            </div>
          </div>

          <div className="step">
            <h4>2. Power</h4>
            <div className="formula">
              <code>P = W/t = 350/30 = 11.67 Watts</code>
            </div>
          </div>
        </div>

        <div className="example-output">
          <h3>Output</h3>
          <div className="code-block">
            <pre>
              {JSON.stringify({
                work: 350,
                power: 11.67
              }, null, 2)}
            </pre>
          </div>
        </div>
      </section>

      <section className="try-calculator">
        <h2>Try It Yourself</h2>
        <p>Ready to calculate your own output scores? Use our interactive calculator to measure and track your performance across different exercises.</p>
        <Link href="/tools/calculator" className="cta-button">
          Try the Calculator
        </Link>
      </section>

      <section className="conclusion">
        <h2>Conclusion</h2>
        <p>
          The <strong>output score</strong> framework combines principles of physics with dynamic programming to offer scalable, accurate performance metrics. By leveraging work and power as foundational metrics, this system provides meaningful insights into athlete progress across a wide variety of exercises.
        </p>
      </section>
    </div>
  );
}
