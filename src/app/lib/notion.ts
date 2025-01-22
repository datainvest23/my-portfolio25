// src/lib/notion.ts
import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY
});

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
  try {
    const blocks = [];
    let cursor;
    
    while (true) {
      const { results, next_cursor } = await notion.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
      });
      
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
      
      if (!next_cursor) break;
      cursor = next_cursor;
    }

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