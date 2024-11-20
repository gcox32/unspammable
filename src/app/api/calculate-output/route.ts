import { NextResponse } from 'next/server';
import { calculateOutput } from '@/src/utils/outputFunctions/calculateOutput';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, outputFunctionName, measures, athleteMetrics } = body;
    console.log('category', category);  
    console.log('outputFunctionName', outputFunctionName);
    console.log('measures', measures);
    console.log('athleteMetrics', athleteMetrics);
    const result = await calculateOutput(
      category.toLowerCase(),
      outputFunctionName,
      athleteMetrics,
      measures
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate output score' },
      { status: 500 }
    );
  }
} 