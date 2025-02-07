// src/app/api/projects/route.ts
import { getDatabase } from '@/lib/notion';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { filterConfig } from '@/lib/config';

export async function GET(request: Request) {
  try {
    // Check authentication first
    const supabase = await createClient();
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // If authenticated, proceed with fetching projects
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // Define the filter for the Notion query based on the 'type' parameter
    const notionFilter = type && type !== 'ALL'
      ? {
        property: 'Type',  // Filter by the 'Type' property
        type: 'select',   // The type of the property is 'select'
        value: type,      // The value to match (e.g., 'Project', 'Dashboard')
      }
      : undefined;

    const projects = await getDatabase(
      process.env.NOTION_DATABASE_ID!,
      notionFilter // Pass the dynamically created filter to getDatabase
    );

    // Transform Notion data to match our Project interface
    const transformedProjects = projects.map((page: any) => {
      let imageUrl = '';
      
      if (page.cover) {
        if (page.cover.type === 'external') {
          // If it's a Notion stock image
          if (page.cover.external.url.includes('notion.so/images/page-cover/')) {
            const coverName = page.cover.external.url.split('/').pop();
            imageUrl = `https://www.notion.so/images/page-cover/${coverName}`;
          } else {
            // For other external URLs (like Unsplash)
            imageUrl = page.cover.external.url;
          }
        } else if (page.cover.type === 'file') {
          imageUrl = page.cover.file.url;
        }
      }

      return {
        id: page.id,
        title: page.properties.Name?.title?.[0]?.plain_text || 'Untitled',
        description: page.properties.Description?.rich_text?.[0]?.plain_text || '',
        shortDescription: page.properties['Short Description']?.rich_text?.[0]?.plain_text || '',
        imageUrl,
        status: page.properties.Status?.select?.name || '',
        type: page.properties.Type?.select?.name || '',
        tags: page.properties.Technologies?.multi_select || [],
        slug: page.properties.Slug?.rich_text?.[0]?.plain_text || page.id,
      };
    });

    // Log the first project for debugging
    if (transformedProjects.length > 0) {
      console.log('First project:', {
        title: transformedProjects[0].title,
        imageUrl: transformedProjects[0].imageUrl,
        rawCover: projects[0].cover
      });
    }

    return NextResponse.json(transformedProjects);

  } catch (error) {
    console.error('Error fetching projects:', error);
    return new NextResponse('Error fetching projects', { status: 500 });
  }
}