export const calculateOutput = async (category, outputFunctionName, athlete, measures) => {
  try {
    const categoryModule = await import(`./${category}/index`);
    const outputFunction = categoryModule[outputFunctionName];
    if (!outputFunction) {
      throw new Error(`Output function '${outputFunctionName}' not found in category '${category}'.`);
    }
    return outputFunction(athlete, measures);
  } catch (error) {
    throw new Error(`Error calculating output: ${error.message}`);
  }
};

