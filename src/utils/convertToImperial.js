export const convertToImperial = (value, unit) => {
    if (unit === 'lbs') {
        value = value * 2.20462;  // Convert kg to lbs
    } else if (unit === 'in') {
        value = value / 2.54;     // Convert cm to inches
    } else if (unit === 'ft') {
        value = value / 30.48;    // Convert cm to feet
    } else if (unit === 'mi') {
        value = value / 1609.34;  // Convert meters to miles
    }
    return Math.round(value * 100) / 100;
}