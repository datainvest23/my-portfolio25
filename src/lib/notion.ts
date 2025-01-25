import { Client } from '@notionhq/client';
import { NotionPage, NotionBlock } from '@/types/notion';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

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
  try {
    const blocks = [];
    let cursor;
    
    while (true) {
      const { results, next_cursor } = await notion.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
      });

      blocks.push(...results);

      if (!next_cursor) break;
      cursor = next_cursor;
    }

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