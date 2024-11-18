export const calculateOutput = async (category, outputFunctionName, athlete, measures) => {
  try {
    const { default: outputFunction } = await import(`./outputFunctions/${category}/${outputFunctionName}`);
    return outputFunction(athlete, measures);
  } catch (error) {
    throw new Error(`Output function '${outputFunctionName}' in category '${category}' not found.`);
  }
};
