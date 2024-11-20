export const convertToMetric = (value, unit) => {
    if (unit === 'lbs') {
        return value * 2.20462, 'kg';
    } else if (unit === 'in') {
        return value * 0.0254, 'm';
    } else if (unit === 'ft') {
        return value * 0.3048, 'm';
    } else if (unit === 'mi') {
        return value * 1609.34, 'm';
    }
    return value, unit;
}   