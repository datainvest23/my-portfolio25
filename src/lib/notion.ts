import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function getDatabase(databaseId: string) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    return response.results;
  } catch (error) {
    console.error('Error fetching Notion database:', error);
    throw new Error('Failed to fetch projects');
  }
}

export async function getBlocks(pageId: string) {
  try {
    const blocks = [];
    let cursor;
    
    while (true) {
      const { results, next_cursor } = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
      });
      
      blocks.push(...results);
      
      if (!next_cursor) break;
      cursor = next_cursor;
    }

    return blocks;
  } catch (error) {
    console.error('Error fetching Notion blocks:', error);
    throw new Error('Failed to fetch project content');
  }
} 