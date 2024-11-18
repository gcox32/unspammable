# **Output Score Calculation Framework**

## **Overview**
The **output score** is a measure of the physical work and power exerted by an athlete during an exercise. It provides a quantitative way to evaluate performance by applying basic physics principles. This framework supports a wide range of exercises, including weightlifting, bodyweight movements, cardio activities, and stationary equipment metrics.

---

## **Physics Principles**

### **1. Work**
In physics, **work** is defined as the force applied to an object times the distance it moves in the direction of the force:
\[
W = F \times d
\]
Where:
- \(W\) = Work (measured in Joules)
- \(F\) = Force applied (measured in Newtons, equivalent to weight in kilograms multiplied by gravity: \(F = \text{weight} \times g\))
- \(d\) = Distance moved (measured in meters)

In this framework:
- **Force** is represented by the weight being moved (e.g., athlete’s bodyweight, barbell weight).
- **Distance** is derived from exercise-specific parameters, such as squat depth or pull-up height.

### **2. Power**
**Power** is the rate at which work is performed:
\[
P = \frac{W}{t}
\]
Where:
- \(P\) = Power (measured in Watts)
- \(W\) = Work (measured in Joules)
- \(t\) = Time taken to complete the work (measured in seconds)

Power provides insight into the intensity of an exercise, making it a useful metric for comparing performances over time.

---

## **General Approach**

### **Inputs for Calculations**
1. **Athlete Data**:
   - Bodyweight (used for bodyweight movements like push-ups and pull-ups).
   - Optional anthropometric data (e.g., limb length for more precise distance calculations).

2. **Exercise-Specific Parameters**:
   - Weight (e.g., barbell or dumbbell load).
   - Distance (e.g., depth of a squat or pull-up height).
   - Repetitions.

3. **Optional Time Data**:
   - Used to calculate power if available.

---

### **Steps in the Calculation**
1. **Determine Work**:
   - Use the formula \(W = F \times d \times \text{reps}\), where:
     - \(F = \text{weight}\)
     - \(d = \text{distance}\)
     - \(\text{reps} = \text{number of repetitions}\)

2. **Determine Power**:
   - If time (\(t\)) is available, compute \(P = \frac{W}{t}\).

3. **Account for Exercise-Specific Logic**:
   - Use exercise-specific data and calculations (e.g., machine-reported calories for rowing or biking).

---

## **Special Cases**

### **Bodyweight Exercises**
For exercises like push-ups and pull-ups:
- **Force** is derived from the athlete’s bodyweight.
- **Distance** is based on the exercise movement (e.g., arm length for pull-ups or chest-to-floor distance for push-ups).

### **Cardio Equipment**
For stationary cardio machines like rowers and bikes:
- **Calories** reported by the machine are used as a proxy for work:
  \[
  W = \text{calories} \times 4184
  \]
  (1 calorie = ~4184 Joules)
- Distance is treated as contextual rather than used in calculations.

---

## **Dynamic Resolution of Output Functions**

### **Dynamic Import**
Each exercise has a specific output function defined in a modular system. The appropriate function is resolved dynamically at runtime based on the exercise category and name.

```javascript
export const calculateOutput = async (category, outputFunctionName, athlete, measures) => {
  try {
    const { default: outputFunction } = await import(`./outputFunctions/${category}/${outputFunctionName}`);
    return outputFunction(athlete, measures);
  } catch (error) {
    throw new Error(`Output function '${outputFunctionName}' in category '${category}' not found.`);
  }
};
```

This approach ensures:
- Scalability for adding new exercises.
- Clear separation of logic for different exercise types.

---

## **Example: Push-Up Calculation**

### **Inputs**
- **Athlete**:
  - Bodyweight: 70 kg
- **Measures**:
  - Repetitions: 10
  - Time: 30 seconds

### **Calculation**
1. **Work**:
   \[
   W = \text{bodyweight} \times \text{distance} \times \text{reps}
   \]
   Assume a default distance of 0.5 meters:
   \[
   W = 70 \times 0.5 \times 10 = 350 \, \text{Joules}
   \]

2. **Power**:
   \[
   P = \frac{W}{t} = \frac{350}{30} = 11.67 \, \text{Watts}
   \]

### **Output**:
```json
{
  "work": 350,
  "power": 11.67
}
```

---

## **Future Enhancements**
- **Complex vs General Logic**:
  - Incorporate athlete-specific data (e.g., limb length) for exercises that benefit from precise calculations.
- **Machine Learning**:
  - Use historical data to refine distance or calorie approximations for individual athletes.

---

## **Conclusion**
The **output score** framework combines principles of physics with dynamic programming to offer scalable, accurate performance metrics. By leveraging work and power as foundational metrics, this system provides meaningful insights into athlete progress across a wide variety of exercises.
