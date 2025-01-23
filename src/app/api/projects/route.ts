import { NextResponse } from 'next/server';
import { getProjects } from '@/services/notion/getProjects';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    const projects = await getProjects(
      type && type !== 'ALL' ? {
        property: 'Type',
        select: {
          equals: type.charAt(0) + type.slice(1).toLowerCase()
        }
      } : undefined
    );

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error in projects API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' }, 
      { status: 500 }
    );
  }
} 