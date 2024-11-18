"use client";

import React from "react";
import "@/src/styles/app.css";

export default function AboutPage() {
  return (
    <main className="about-page">
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
          a wide range of exercises, including weightlifting, bodyweight
          movements, cardio activities, and stationary equipment metrics.
        </p>
      </section>

      <section className="physics">
        <h2>Physics Principles</h2>
        
        <div className="principle">
          <h3>Work</h3>
          <p>
            In physics, work is defined as the force applied to an object times
            the distance it moves in the direction of the force:
          </p>
          <div className="formula">
            <code>W = F × d</code>
          </div>
          <p>Where:</p>
          <ul>
            <li>W = Work (measured in Joules)</li>
            <li>F = Force applied (measured in Newtons)</li>
            <li>d = Distance moved (measured in meters)</li>
          </ul>
        </div>

        <div className="principle">
          <h3>Power</h3>
          <p>
            Power is the rate at which work is performed:
          </p>
          <div className="formula">
            <code>P = W/t</code>
          </div>
          <p>Where:</p>
          <ul>
            <li>P = Power (measured in Watts)</li>
            <li>W = Work (measured in Joules)</li>
            <li>t = Time taken (measured in seconds)</li>
          </ul>
        </div>
      </section>

      <section className="implementation">
        <h2>Framework Implementation</h2>
        <div className="feature">
          <h3>Dynamic Resolution</h3>
          <p>
            Each exercise has a specific output function defined in a modular
            system. The appropriate function is resolved dynamically at runtime
            based on the exercise category and name, ensuring scalability and
            clear separation of logic.
          </p>
        </div>

        <div className="feature">
          <h3>Comprehensive Support</h3>
          <p>
            Our framework handles various exercise types:
          </p>
          <ul>
            <li>Weightlifting movements</li>
            <li>Bodyweight exercises</li>
            <li>Cardio activities</li>
            <li>Machine-based workouts</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
