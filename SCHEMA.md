### **Data Structure Summary**

#### **1. Exercise**
- **Purpose**: Represents a distinct, reusable exercise definition.
- **Fields**:
  - `exercise_id` (UUID): Unique identifier.
  - `name` (String): Name of the exercise (e.g., "Back Squat").
  - `description` (String): Optional details or instructions (e.g., "Barbell back squat with proper form").
  - `video_url` (String, optional): URL to a video demonstrating the exercise.
  - `category` (String, optional): Category of the exercise (e.g., "Strength", "Conditioning").
  - `equipment` (Array of Strings, optional): Equipment required (e.g., ["Barbell", "Squat Rack"]).
  - `default_measures` (Array):
    - Each measure includes:
      - `measure_id` (UUID): Unique identifier.
      - `type` (String): Type of measure (e.g., "weight", "reps", "time").
      - `unit` (String): Unit of measurement (e.g., "kg", "reps", "seconds").

---

#### **2. Workout Part Template**
- **Purpose**: Represents a reusable part of a workout.
- **Fields**:
  - `part_template_id` (UUID): Unique identifier.
  - `name` (String): Name of the part (e.g., "3 Rep Max Back Squat").
  - `description` (String): Optional description of the part (e.g., "Strength training part").
  - **Exercises** (Array):
    - Each exercise includes:
      - `exercise_id` (UUID): Reference to the exercise model.
      - **Custom Measures** (Array, optional): Overrides for the default exercise measures.

---

#### **3. Workout Template**
- **Purpose**: Defines the reusable structure of a workout.
- **Fields**:
  - `template_id` (UUID): Unique identifier.
  - `name` (String): Name of the workout (e.g., "Leg Day").
  - `description` (String): Optional description of the workout.
  - **Parts** (Array):
    - Each part includes:
      - `part_template_id` (UUID): Reference to a reusable workout part template.
      - `sequence_order` (Integer): Order of the part in the workout.

---

#### **4. Workout**
- **Purpose**: Represents an instance of a workout template tied to a specific time.
- **Fields**:
  - `workout_id` (UUID): Unique identifier.
  - `template_id` (UUID): Reference to the associated workout template.
  - `date` (DateTime): Scheduled or completed date of the workout.
  - **Athletes** (Array): List of athlete IDs participating in the workout.

---

#### **5. Workout Log**
- **Purpose**: Tracks an athlete's performance and completion details for a workout.
- **Fields**:
  - `log_id` (UUID): Unique identifier.
  - `workout_id` (UUID): Reference to the specific workout.
  - `athlete_id` (UUID): Reference to the athlete completing the workout.
  - `completion_date` (DateTime): Timestamp of workout completion.
  - **Part Logs** (Array):
    - Each log includes:
      - `part_log_id` (UUID): Unique identifier.
      - `part_template_id` (UUID): Reference to the part template in the workout.
      - `status` (String): Completion status (e.g., "Completed", "Skipped").
      - **Exercise Logs** (Array):
        - Each log includes:
          - `exercise_log_id` (UUID): Unique identifier.
          - `exercise_id` (UUID): Reference to the exercise in the model.
          - **Measure Values** (Array):
            - Each value includes:
              - `measure_id` (UUID): Reference to the measure in the exercise model.
              - `actual_value` (Float): Value entered by the athlete (e.g., weight lifted, reps completed).
              
---

#### **6. Athlete**
- **Purpose**: Represents a user who performs workouts and tracks fitness-related metrics.
- **Fields**:
  - `athlete_id` (UUID): Unique identifier.
  - `name` (String): Athlete's name.
  - `email` (String): Email address for communication.
  - `crm_id` (String, optional): Reference to an external CRM profile.
  - **Profile** (One-to-One):
    - Contains static personal and physical attributes such as age, gender, height, and weight.
  - **Tracking Metrics** (One-to-Many):
    - Links to all metrics being tracked by the athlete, such as weight or body fat percentage.

---

#### **7. Profile**
- **Purpose**: Captures static personal and physical attributes of an athlete.
- **Fields**:
  - `profile_id` (UUID): Unique identifier.
  - `athlete_id` (UUID): Reference to the associated athlete.
  - `age` (Integer): Athlete’s age.
  - `gender` (String): Gender (e.g., "Male", "Female").
  - `height` (Float): Height in centimeters or other preferred units.
  - `weight` (Float): Current weight in kilograms or other preferred units.
  - **Optional Fields**:
    - `body_fat_percentage` (Float): Current body fat percentage.
    - `goals` (String): Athlete’s high-level fitness goals.
    - `experience_level` (String): Fitness level (e.g., "Beginner", "Intermediate").
    - `resting_heart_rate` (Integer): Resting heart rate in bpm.
    - `preferred_units` (String): Measurement units (e.g., "Metric").

---

#### **8. Tracking Metric**
- **Purpose**: Represents a specific type of metric the athlete is tracking (e.g., weight, body fat percentage).
- **Fields**:
  - `metric_id` (UUID): Unique identifier.
  - `athlete_id` (UUID): Reference to the associated athlete.
  - `type` (String): The type of metric being tracked (e.g., "weight", "body_fat_percentage").
  - `unit` (String): Unit of measurement (e.g., "kg", "%").
  - **Entries** (One-to-Many):
    - Links to all time-series entries recorded for this metric.

---

#### **9. Tracking Metric Entry**
- **Purpose**: Represents a single recorded measurement for a specific metric.
- **Fields**:
  - `entry_id` (UUID): Unique identifier.
  - `metric_id` (UUID): Reference to the associated tracking metric.
  - `date` (DateTime): Date and time of the measurement.
  - `value` (Float): The recorded value (e.g., "80.0 kg").
  - **Optional Fields**:
    - `notes` (String): Additional observations about the measurement (e.g., "Morning weigh-in").
    - `confidence_level` (String or Integer): Optional metadata about the accuracy of the measurement.

---

### **Workflow with Complete Structure**

Here’s a step-by-step **workflow** based on the completed structure. This workflow highlights how admins, athletes, and the system interact with the data.

---

### **1. Admin Creates the Base Elements**

#### **Step 1: Create Exercises**
- **Action**: Admin defines reusable exercises.
- **Example**:
  - `exercise_id`: "squat-001"
  - `name`: "Back Squat"
  - `default_measures`:  
    - Measure 1: `type`: "weight", `unit`: "kg"  
    - Measure 2: `type`: "reps", `unit`: "reps"

#### **Step 2: Create Workout Part Templates**
- **Action**: Admin combines exercises into a reusable workout part.
- **Example**:
  - `part_template_id`: "part-001"
  - `name`: "3 Rep Max Back Squat"
  - **Exercises**:  
    - `exercise_id`: "squat-001"
    - `custom_measures`:  
      - Measure 1: `type`: "reps", `target_value`: 3

#### **Step 3: Create Workout Templates**
- **Action**: Admin assembles parts into a full workout template.
- **Example**:
  - `template_id`: "workout-001"
  - `name`: "Strength Day"
  - **Parts**:  
    - Part 1: `part_template_id`: "part-001", `sequence_order`: 1  
    - Part 2: `part_template_id`: "part-002", `sequence_order`: 2 ("Deadlift Progression").

---

### **2. Admin Schedules a Workout**
- **Action**: Admin creates a specific workout instance for athletes to perform.
- **Example**:
  - `workout_id`: "instance-001"
  - `template_id`: "workout-001"
  - `date`: "2024-11-20"

---

### **3. Athlete Logs the Workout**
#### **Step 1: Athlete Views Assigned Workout**
- **System Action**: Fetch the workout details for the specific date.
- **Example**:
  - Workout:
    - Part 1: "3 Rep Max Back Squat"  
      - Exercise: "Back Squat"  
        - Target Measures: 3 reps at increasing weight.
    - Part 2: "Deadlift Progression"

#### **Step 2: Athlete Performs and Logs Workout**
- **Action**: Athlete logs completed parts and exercises.
- **Example**:
  - Workout Log:  
    - `log_id`: "log-001"
    - `workout_id`: "instance-001"
    - `athlete_id`: "athlete-001"
    - `completion_date`: "2024-11-20"
    - **Part Logs**:
      - Part 1:  
        - `part_log_id`: "part-log-001"  
        - `status`: "Completed"
        - **Exercise Logs**:
          - `exercise_log_id`: "exercise-log-001"
          - `exercise_id`: "squat-001"
          - `measure_values`:  
            - Measure 1: `type`: "weight", `actual_value`: 100  
            - Measure 2: `type`: "reps", `actual_value`: 3

---

### **4. Admin Reviews Data**
- **Action**: Admin generates reports or reviews logs.
- **Examples**:
  1. **Workout Completion Report**:
     - Percentage of athletes who completed "3 Rep Max Back Squat" in "Strength Day."
  2. **Progress Tracking**:
     - Trends in an athlete's 3 Rep Max Back Squat weight over time.

---

### **Summary of Workflow**

1. **Setup Phase**:
   - Admin defines reusable exercises.
   - Admin groups exercises into reusable parts (Workout Part Templates).
   - Admin creates structured workouts (Workout Templates) using parts.

2. **Assignment Phase**:
   - Admin schedules workouts for specific athletes or teams.

3. **Execution Phase**:
   - Athletes perform and log workouts, capturing part-level and exercise-level details.

4. **Review Phase**:
   - Admin analyzes logs for performance tracking, trends, and program effectiveness.

---

### **Relationship Summary**

Here’s a comprehensive summary of the relationships between the entities in the finalized structure:

---

#### **1. Athlete Relationships**
- **Athlete ↔ Profile**:  
  - **One-to-One**: Each athlete has a single profile containing demographic and physical details.

- **Athlete ↔ Tracking Metric**:  
  - **One-to-Many**: An athlete can track multiple metrics (e.g., weight, body fat percentage).

- **Tracking Metric ↔ Tracking Metric Entry**:  
  - **One-to-Many**: Each metric has multiple time-series entries for tracked data.

- **Athlete ↔ Workout Log**:  
  - **One-to-Many**: An athlete can have multiple logs, one for each workout performed.

---

#### **2. Workout Template Relationships**
- **Workout Template ↔ Workout Part Template**:  
  - **One-to-Many**: A workout template consists of multiple parts, referencing reusable workout part templates.

- **Workout Template ↔ Workout**:  
  - **One-to-Many**: A workout template can spawn multiple specific workout instances.

- **Workout Part Template ↔ Exercise**:  
  - **One-to-Many**: A workout part template includes multiple exercises.

- **Workout Part Template ↔ Workout Log** (via Part Logs):  
  - **One-to-Many**: Each workout part template can appear in multiple workout logs when performed.

---

#### **3. Workout Relationships**
- **Workout ↔ Athlete**:  
  - **Many-to-Many**: A workout can include multiple athletes, and an athlete can participate in multiple workouts.  
  - **Implemented via Join Table**: `Workout Athlete`.

- **Workout ↔ Workout Log**:  
  - **One-to-Many**: Each workout instance can generate multiple logs, one for each athlete.

- **Workout ↔ Workout Template**:  
  - **Many-to-One**: Each workout is based on a single workout template.

---

#### **4. Workout Log Relationships**
- **Workout Log ↔ Part Log**:  
  - **One-to-Many**: A workout log contains part logs for each workout part.

- **Part Log ↔ Exercise Log**:  
  - **One-to-Many**: A part log contains exercise logs for each exercise in the part.

- **Exercise Log ↔ Measure**:  
  - **One-to-Many**: Each exercise log references measures (e.g., weight, reps) and their recorded values.

---

#### **5. Exercise Relationships**
- **Exercise ↔ Measure**:  
  - **One-to-Many**: Each exercise defines multiple measures (e.g., weight, reps).

- **Exercise ↔ Workout Part Template**:  
  - **Many-to-Many**: An exercise can belong to multiple workout part templates, and a workout part template can include multiple exercises.

- **Exercise ↔ Exercise Log**:  
  - **One-to-Many**: Each exercise can have multiple logs tied to different workout parts and athletes.

---

### **Entity Relationship Diagram (Conceptual)**

Here’s how the relationships map conceptually:

1. **Athlete** ↔ **Profile** (One-to-One)
2. **Athlete** ↔ **Tracking Metric** ↔ **Tracking Metric Entry** (One-to-Many)
3. **Athlete** ↔ **Workout Log** ↔ **Part Log** ↔ **Exercise Log** (One-to-Many hierarchy)
4. **Workout Template** ↔ **Workout Part Template** ↔ **Exercise** ↔ **Measure** (Hierarchical and Reusable)
5. **Workout** ↔ **Workout Template** ↔ **Workout Part Template** ↔ **Exercise**
6. **Workout** ↔ **Athlete** (Many-to-Many via `Workout Athlete`)

---

### **Key Points**
- **Reusability**: Workout Part Templates and Exercises ensure minimal redundancy and simplify updates.
- **Granularity**: The hierarchy from Workout Log → Part Log → Exercise Log provides detailed tracking.
- **Flexibility**: Relationships like Many-to-Many between Workouts and Athletes allow scalable team management.

Does this summary align with your vision, or should we refine any of these relationships further?