export const convertUnits = (value, fromUnit, toUnit) => {
    // Conversion rates object
    const conversions = {
        'kg': { 'lbs': 2.20462 },
        'lbs': { 'kg': 1 / 2.20462 },
        'cm': { 'in': 1 / 2.54 },
        'in': { 'cm': 2.54 },
        'm': { 'ft': 3.28084, 'in': 39.3701, 'mi': 1 / 1609.34 },
        'ft': { 'm': 0.3048 },
        'mi': { 'm': 1609.34 }
    };

    // Check if conversion exists
    if (!conversions[fromUnit] || !conversions[fromUnit][toUnit]) {
        throw new Error(`Conversion from ${fromUnit} to ${toUnit} is not supported`);
    }

    // Perform conversion
    const convertedValue = value * conversions[fromUnit][toUnit];
    return Math.round(convertedValue * 100) / 100;
};   