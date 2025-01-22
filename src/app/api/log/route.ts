import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Here you would typically store the log in a database
    console.log('Access log:', data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging access:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
} 