// src/lib/notion.ts
import { Client } from '@notionhq/client';
import { NotionPage, NotionBlock } from '@/types/notion';

const notion = new Client({
  auth: process.env.NOTION_API_KEY
});

<<<<<<< HEAD
export async function getDatabase(databaseId: string, filter?: {
  property: string;
  select?: {
    equals?: string;
  };
}) {
  const response = await notion.databases.query({
    database_id: databaseId,
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
  });
  return response.results;
}

export async function getBlocks(blockId: string) {
=======
export async function getDatabase(databaseId: string): Promise<NotionPage[]> {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          timestamp: 'last_edited_time',
          direction: 'descending',
        },
      ],
    });

    return response.results as NotionPage[];
  } catch (error) {
    console.error('Error fetching database:', error);
    throw new Error('Failed to fetch database');
  }
}

export async function getBlocks(blockId: string): Promise<NotionBlock[]> {
>>>>>>> 997e0693bb39e8a6f5bf00e575adaeff1de1c18b
  try {
    const blocks = [];
    let cursor;
    
    while (true) {
      const { results, next_cursor } = await notion.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
      });
<<<<<<< HEAD
      
      // Process each block to handle embedded content
      const processedResults = await Promise.all(
        results.map(async (block: any) => {
          // Handle image blocks
          if (block.type === 'image') {
            const imageBlock = {
              ...block,
              image: {
                ...block.image,
                url: block.image.type === 'file' 
                  ? block.image.file.url 
                  : block.image.external.url
              }
            };
            return imageBlock;
          }

          // Handle embedded content (like videos, PDFs, etc.)
          if (block.type === 'embed' || block.type === 'video' || block.type === 'pdf') {
            return {
              ...block,
              [block.type]: {
                ...block[block.type],
                url: block[block.type].external?.url || block[block.type].file?.url
              }
            };
          }

          // Handle file blocks
          if (block.type === 'file') {
            return {
              ...block,
              file: {
                ...block.file,
                url: block.file.type === 'file' 
                  ? block.file.file.url 
                  : block.file.external.url
              }
            };
          }

          return block;
        })
      );
      
      blocks.push(...processedResults);
      
=======

      blocks.push(...results);

>>>>>>> 997e0693bb39e8a6f5bf00e575adaeff1de1c18b
      if (!next_cursor) break;
      cursor = next_cursor;
    }

<<<<<<< HEAD
    // Fetch child blocks for any block that has children
    const childBlocks = await Promise.all(
      blocks
        .filter((block: any) => block.has_children)
        .map(async (block: any) => {
          const children = await getBlocks(block.id);
          return { ...block, children };
        })
    );

    const blocksWithChildren = blocks.map((block: any) => {
      if (block.has_children) {
        return childBlocks.find((x: any) => x.id === block.id);
      }
      return block;
    });

    return blocksWithChildren;
  } catch (error) {
    console.error('Error fetching blocks:', error);
    return [];
  }
}

export async function getProjectDetails(pageId: string) {
  try {
    const response = await notion.pages.retrieve({
      page_id: pageId
    });

    // Get the cover image URL from the Notion page
    let coverImage = null;
    if (response.cover) {
      if ('external' in response.cover) {
        coverImage = response.cover.external.url;
      } else if ('file' in response.cover) {
        coverImage = response.cover.file.url;
      }
    }

    return {
      id: response.id,
      cover_image: coverImage,
      // Add other properties as needed
    };
  } catch (error) {
    console.error('Error fetching project details:', error);
    return null;
  }
}
=======
    return blocks as NotionBlock[];
  } catch (error) {
    console.error('Error fetching blocks:', error);
    throw new Error('Failed to fetch blocks');
  }
}

export async function getPage(pageId: string): Promise<NotionPage> {
  try {
    const response = await notion.pages.retrieve({
      page_id: pageId,
    });

    return response as NotionPage;
  } catch (error) {
    console.error('Error fetching page:', error);
    throw new Error('Failed to fetch page');
  }
}

export async function getProjects(): Promise<NotionPage[]> {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    sorts: [
      {
        property: 'Name',
        direction: 'ascending',
      },
    ],
  });

  return response.results as NotionPage[];
}

export async function getProjectBySlug(slug: string): Promise<NotionPage | null> {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: 'Slug',
      rich_text: {
        equals: slug,
      },
    },
  });

  return response.results[0] as NotionPage || null;
}

export async function getProjectContent(pageId: string) {
  const blocks = await notion.blocks.children.list({
    block_id: pageId,
  });

  return blocks.results;
} 
>>>>>>> 997e0693bb39e8a6f5bf00e575adaeff1de1c18b
