export const convertToMetric = (value, unit) => {
    if (unit === 'lbs') {
        value = value / 2.20462;
    } else if (unit === 'in') {
        value = value * 2.54;
    } else if (unit === 'ft') {
        value = value * 30.48;
    } else if (unit === 'mi') {
        value = value * 1609.34;
    }
    return Math.round(value * 100) / 100;
}   