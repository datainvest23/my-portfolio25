import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@notionhq/client';
import { NotionPage } from '@/types/notion';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const databaseId = process.env.NOTION_DATABASE_ID!;
    
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Slug",
        rich_text: {
          equals: id
        }
      }
    });

    if (!response.results.length) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const page = response.results[0] as NotionPage;

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
} 