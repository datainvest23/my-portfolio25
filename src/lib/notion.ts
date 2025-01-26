import { Client } from '@notionhq/client';

// Initialize the Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

/**
 * Fetch all projects from the Notion database with optional filters.
 * @param databaseId - The Notion database ID.
 * @param filter - Optional filter object to narrow down the results.
 * @returns Array of database results.
 */
export async function getDatabase(
  databaseId: string,
  filter?: {
    property: string;
    type: string; // The type of the property, e.g., "rich_text", "select"
    value: string; // The value to match against
  }
) {
  try {
    // Construct the filter
    const notionFilter = filter
      ? {
          and: [
            {
              property: 'Status',
              select: { equals: 'Published' }, // Ensure the "Status" property is valid
            },
            {
              property: filter.property, // Dynamically specify the property
              [filter.type]: { equals: filter.value }, // Ensure the correct type and value
            },
          ],
        }
      : {
          property: 'Status',
          select: { equals: 'Published' }, // Default filter: only "Published" projects
        };

    // Query the database
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: notionFilter,
    });

    return response.results;
  } catch (error) {
    console.error('Error querying Notion database:', error);
    throw new Error('Failed to fetch data from Notion.');
  }
}

/**
 * Fetch all blocks (and their children) for a specific page from Notion.
 * @param blockId - The ID of the Notion block/page.
 * @returns Array of blocks.
 */
export async function getBlocks(blockId: string) {
  try {
    let blocks = [];
    let cursor;

    // Fetch blocks iteratively (handle pagination)
    while (true) {
      const { results, next_cursor } = await notion.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
      });
      blocks = blocks.concat(results);
      if (!next_cursor) break;
      cursor = next_cursor;
    }

    // Fetch child blocks recursively for blocks that have children
    const childBlocks = await Promise.all(
      blocks
        .filter((block: any) => block.has_children)
        .map(async (block: any) => {
          const children = await getBlocks(block.id);
          return { ...block, children };
        })
    );

    return blocks.map((block: any) => {
      if (block.has_children) {
        return childBlocks.find((child: any) => child.id === block.id);
      }
      return block;
    });
  } catch (error) {
    console.error('Error fetching Notion blocks:', error);
    throw new Error('Failed to fetch Notion blocks.');
  }
}

/**
 * Fetch a single project from the Notion database using its slug.
 * @param databaseId - The Notion database ID.
 * @param slug - The slug to search for.
 * @returns The first matching project or null if none found.
 */
export async function getProjectBySlug(databaseId: string, slug: string) {
  try {
    const projects = await getDatabase(databaseId, {
      property: 'Slug',
      type: 'rich_text', // Ensure the correct type is used
      value: slug,
    });

    return projects.length > 0 ? projects[0] : null;
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    throw new Error('Failed to fetch project by slug.');
  }
}

/**
 * Fetch related projects excluding the current slug.
 * @param databaseId - The Notion database ID.
 * @param currentSlug - The slug to exclude from results.
 * @param count - The maximum number of related projects to return.
 * @returns Array of related projects.
 */
export async function getRelatedProjects(databaseId: string, currentSlug: string, count = 3) {
  try {
    const projects = await getDatabase(databaseId);

    // Filter out the current project and return a limited number of related projects
    return projects
      .filter(
        (project: any) =>
          project.properties.Slug.rich_text[0]?.plain_text !== currentSlug
      )
      .slice(0, count);
  } catch (error) {
    console.error('Error fetching related projects:', error);
    throw new Error('Failed to fetch related projects.');
  }
}
