import { NextResponse } from 'next/server';
import digitaltwinData from '@/digitaltwin.json';

export async function GET() {
  try {
    // Extract education information from digitaltwin.json
    const education = digitaltwinData.education;
    
    if (!education) {
      return NextResponse.json(
        { error: 'Education information not found' },
        { status: 404 }
      );
    }

    // Return formatted education data
    return NextResponse.json({
      current: education.current,
      undergraduate: education.undergraduate,
      summary: {
        current_degree: education.current.degree,
        current_university: education.current.university,
        current_location: education.current.location,
        expected_graduation: education.current.expected_graduation,
        undergraduate_degree: education.undergraduate.degree,
        undergraduate_university: education.undergraduate.university,
        undergraduate_location: education.undergraduate.location,
        graduation_year: education.undergraduate.graduation_year,
      }
    });
  } catch (error) {
    console.error('Error fetching education data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch education data' },
      { status: 500 }
    );
  }
}
