import { notFound } from 'next/navigation';

if (!process.env.NOTION_API_KEY) {
  throw new Error('NOTION_API_KEY is not set in environment variables');
}

if (!process.env.NOTION_DATABASE_ID) {
  throw new Error('NOTION_DATABASE_ID is not set in environment variables');
}

export async function getProjects(filter?: {
  property: string;
  select?: {
    equals?: string;
  };
}) {
  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify({
          filter: filter ? {
            and: [
              {
                property: "Status",
                select: {
                  equals: "Published"
                }
              },
              filter
            ]
          } : undefined
        }),
        next: { 
          revalidate: 86400 // Cache for 24 hours
        }
      }
    );

    if (!response.ok) {
      console.error('Notion API Error:', {
        status: response.status,
        statusText: response.statusText
      });

      const errorBody = await response.json().catch(() => null);
      console.error('Error response body:', errorBody);

      if (response.status === 404) {
        notFound();
      }

      throw new Error(`Failed to fetch projects from Notion API: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform the data to match your application's needs
    return data.results.map((page: any) => {
       let imageUrl: string | null = null;
        if (page.properties?.Image?.files && page.properties.Image.files.length > 0) {
           const file = page.properties.Image.files[0];
           imageUrl = file.type === 'external' ? file.external.url : file.file.url
        } else if (page.cover) {
           if (page.cover.type === 'external') {
              imageUrl = page.cover.external.url;
            } else if (page.cover.type === 'file') {
                imageUrl = page.cover.file.url;
            }
        }
      return {
        id: page.id,
        title: page.properties.Name?.title?.[0]?.plain_text || 'Untitled',
        description: page.properties.Description?.rich_text?.[0]?.plain_text || '',
        shortDescription: page.properties['Short Description']?.rich_text?.[0]?.plain_text || '',
         imageUrl:  imageUrl || '/placeholder-image.jpg',
        type: page.properties.Type?.select?.name || '',
        tags: Array.isArray(page.properties.Technologies?.multi_select) 
          ? page.properties.Technologies.multi_select 
          : [],
        aiKeywords: Array.isArray(page.properties['AI keywords']?.multi_select)
          ? page.properties['AI keywords'].multi_select.map((item: any) => item.name)
          : [],
        slug: page.properties.Slug?.rich_text?.[0]?.plain_text || page.id,
      }
    });

  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}