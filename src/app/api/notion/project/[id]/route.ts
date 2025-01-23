import { NextRequest } from 'next/server';
import { notFound } from 'next/navigation';
import { Client } from '@notionhq/client';
import { NotionPage } from '@/types/notion';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await notion.pages.retrieve({
      page_id: params.id,
    });

    if (!response) {
      notFound();
    }

    // Type assertion since we know the structure
    const page = response as NotionPage;

    return Response.json(page);
  } catch (error) {
    console.error('Error fetching project:', error);
    return new Response('Failed to fetch project', { status: 500 });
  }
} 