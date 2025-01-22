import { NextResponse } from 'next/server';
import { getDatabase } from '@/app/lib/notion';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    const database = await getDatabase(process.env.NOTION_DATABASE_ID!, 
      type && type !== 'ALL' ? {
        property: 'Type',
        select: {
          equals: type.charAt(0) + type.slice(1).toLowerCase()
        }
      } : undefined
    );

    const projects = database.map((page: any) => {
      const properties = page.properties || {};
      return {
        id: page.id,
        title: properties.Name?.title?.[0]?.plain_text || 'Untitled',
        description: properties.Description?.rich_text?.[0]?.plain_text || '',
        shortDescription: properties['Short Description']?.rich_text?.[0]?.plain_text || '',
        imageUrl: page.cover?.external?.url || page.cover?.file?.url || '',
        type: properties.Type?.select?.name || '',
        tags: Array.isArray(properties.Technologies?.multi_select) 
          ? properties.Technologies.multi_select 
          : [],
        aiKeywords: Array.isArray(properties['AI keywords']?.multi_select)
          ? properties['AI keywords'].multi_select.map((item: any) => item.name)
          : [],
        slug: properties.Slug?.rich_text?.[0]?.plain_text || page.id,
      };
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
} 