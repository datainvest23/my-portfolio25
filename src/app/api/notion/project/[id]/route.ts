import { NextResponse } from 'next/server';
import { getDatabase } from '@/app/lib/notion';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID!;
    const pages = await getDatabase(databaseId);
    
    // Find the page that matches our slug
    const page = pages.find((page: any) => {
      const slug = page.properties.Slug?.rich_text[0]?.plain_text;
      return slug === params.id;
    });

    if (!page) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get the image URL from the Image property
    let imageUrl = null;
    const imageProperty = page.properties.Image;
    
    if (imageProperty && imageProperty.files && imageProperty.files.length > 0) {
      const file = imageProperty.files[0];
      if (file.type === 'external') {
        imageUrl = file.external.url;
      } else if (file.type === 'file') {
        imageUrl = file.file.url;
      }
    }

    return NextResponse.json({
      id: page.id,
      cover_image: imageUrl,
    });
  } catch (error) {
    console.error('Error fetching project details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project details' },
      { status: 500 }
    );
  }
} 