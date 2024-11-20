import { NextResponse } from 'next/server';
import { calculateOutput } from '@/src/utils/outputFunctions/calculateOutput';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { measuresArray, athleteMetrics, time, constantsArray } = body;
    const result = calculateOutput(athleteMetrics, measuresArray, time, constantsArray);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate output score' },
      { status: 500 }
    );
  }
} 