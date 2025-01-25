import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const databaseId = process.env.NOTION_DATABASE_ID!;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'ALL';

    const query: any = {
      database_id: databaseId,
      // Remove sorting for now
      // sorts: [
      //   {
      //     property: 'created_time',
      //     direction: 'descending',
      //   },
      // ],
    };

    // Add filter if type is not ALL
    if (type !== 'ALL') {
      query.filter = {
        property: 'Type',
        select: {
          equals: type,
        },
      };
    }

    // First, let's get the database schema to see available properties
    const database = await notion.databases.retrieve({ database_id: databaseId });
    console.log('Database schema:', JSON.stringify(database.properties, null, 2));

    const response = await notion.databases.query(query);
    
    // Add debug logging
    console.log('Query:', JSON.stringify(query, null, 2));
    console.log('Response status:', response.object);
    console.log('Number of results:', response.results.length);

    if (response.results.length === 0) {
      console.log('No results found for query');
    } else {
      console.log('First result properties:', 
        JSON.stringify(response.results[0].properties, null, 2)
      );
    }

    return NextResponse.json(response.results);
  } catch (error) {
    console.error('Error fetching projects:', error);
    
    // Improve error response
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Failed to fetch projects',
          details: error.message,
          // Add request details for debugging
          query: searchParams.toString(),
        }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch projects' }, 
      { status: 500 }
    );
  }
} 