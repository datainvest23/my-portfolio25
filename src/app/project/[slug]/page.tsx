// src/app/project/[slug]/page.tsx
import { getDatabase, getBlocks } from '@/lib/notion';
import TableOfContents from '@/components/TableOfContents';
import RelatedProjectCard from '@/components/RelatedProjectCard';
import { InterestButton } from '@/components/InterestButton';
import { AnimatedHeaderCard } from '@/components/AnimatedHeaderCard';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    slug: string;
  };
}

function renderBlock(block: any) {
  const { type, id } = block;
  const value = block[type];

  const renderRichText = (richText: any[]) => {
    return richText.map((text: any, i: number) => {
      const {
        annotations: { bold, code, color, italic, strikethrough, underline },
        text: { content, link }
      } = text;
      
      const textContent = (
        <span
          key={i}
          className={[
            bold ? 'font-bold' : '',
            code ? 'font-mono bg-gray-100 rounded px-1' : '',
            italic ? 'italic' : '',
            strikethrough ? 'line-through' : '',
            underline ? 'underline' : '',
          ].join(' ')}
          style={color !== 'default' ? { color } : {}}
        >
          {content}
        </span>
      );

      return link ? (
        <a href={link.url} key={i} className="text-blue-600 hover:underline">
          {textContent}
        </a>
      ) : textContent;
    });
  };

  switch (type) {
                case 'paragraph':
                  return (
        <p key={id} className="mb-4">
          {renderRichText(value.rich_text)}
                    </p>
                  );

                case 'heading_1':
                  return (
        <h1 id={id} key={id} className="text-3xl font-bold mt-8 mb-4">
          {renderRichText(value.rich_text)}
                    </h1>
                  );

                case 'heading_2':
                  return (
        <h2 id={id} key={id} className="text-2xl font-bold mt-6 mb-4">
          {renderRichText(value.rich_text)}
                    </h2>
                  );

                case 'heading_3':
                  return (
        <h3 id={id} key={id} className="text-xl font-bold mt-4 mb-3">
          {renderRichText(value.rich_text)}
                    </h3>
                  );

    case 'bulleted_list_item':
                case 'numbered_list_item':
      const listItem = (
        <li key={id} className="ml-4">
          {renderRichText(value.rich_text)}
          {value.children?.map((block: any) => (
            <div key={block.id} className="ml-6 mt-2">
              {renderBlock(block)}
            </div>
          ))}
                      </li>
      );

      // Group consecutive list items
      if (type === 'bulleted_list_item') {
        return <ul className="list-disc mb-4">{listItem}</ul>;
      }
      return <ol className="list-decimal mb-4">{listItem}</ol>;
    
    case 'image':
      const src = value.type === 'external' ? value.external.url : value.file.url;
      const caption = value.caption?.length ? renderRichText(value.caption) : '';
                  return (
        <figure key={id} className="my-8">
          <img src={src} alt={caption} className="rounded-lg w-full" />
          {caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">
              {caption}
            </figcaption>
          )}
        </figure>
                  );

                case 'code':
                  return (
        <pre key={id} className="bg-gray-800 text-white p-4 rounded-lg my-4 overflow-x-auto">
          <code className="text-sm font-mono">
            {value.rich_text[0].plain_text}
                      </code>
                    </pre>
                  );

                case 'quote':
                  return (
        <blockquote key={id} className="border-l-4 border-gray-300 pl-4 py-1 my-4 italic text-gray-700">
          {renderRichText(value.rich_text)}
                    </blockquote>
                  );
    
    case 'divider':
      return <hr key={id} className="my-8 border-gray-200" />;

                case 'callout':
                  return (
        <div key={id} className="bg-gray-50 rounded-lg p-4 my-4 flex items-start">
          {value.icon?.emoji && (
            <div className="mr-4 text-xl">{value.icon.emoji}</div>
          )}
          <div>{renderRichText(value.rich_text)}</div>
                      </div>
      );

    case 'table':
      return (
        <div key={id} className="my-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="divide-y divide-gray-200">
              {value.children?.map((row: any) => (
                <tr key={row.id}>
                  {row.table_row.cells.map((cell: any[], i: number) => (
                    <td key={i} className="px-4 py-2 whitespace-nowrap">
                      {renderRichText(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
                    </div>
                  );

    default:
      console.log(`❌ Unsupported block type: ${type}`);
      return null;
  }
}

function extractHeadings(blocks: any[]) {
  return blocks
    .filter((block: any) => block.type === 'heading_2' || block.type === 'heading_3')
    .map((block: any) => ({
      id: block.id,
      text: block[block.type].rich_text[0]?.plain_text || '',
      level: parseInt(block.type.slice(-1))
    }));
}

function getRandomProjects(database: any[], currentSlug: string, count = 3) {
  const otherProjects = database.filter(
    (project: any) => 
      project.properties.Slug.rich_text[0]?.plain_text !== currentSlug
  );
  
  const shuffled = [...otherProjects].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default async function ProjectPage({ params }: PageProps) {
  try {
    const database = await getDatabase(process.env.NOTION_DATABASE_ID!);
    
    const page = database.find((page: any) => {
      return page.properties.Slug.rich_text[0]?.plain_text === params.slug;
    });

    if (!page) {
      notFound();
    }

    const blocks = await getBlocks(page.id);
    const headings = extractHeadings(blocks);
    const projectName = page.properties.Name.title[0]?.plain_text;
    const projectDescription = page.properties['Short Description']?.rich_text[0]?.plain_text;
    const projectTechnologies = page.properties.Technologies?.multi_select || [];
    const relatedProjects = getRandomProjects(database, params.slug);

                  return (
      <div className="container mx-auto px-4 py-8">
        <div className="relative">
          {/* Cover Image with Overlay Card */}
          <div className="relative h-[400px] mb-8 rounded-xl overflow-hidden">
            {page.cover?.external?.url && (
              <div className="absolute inset-0">
                <img 
                  src={page.cover.external.url} 
                  alt={projectName} 
                  className="w-full h-full object-cover"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
              </div>
            )}

            {/* Project Info Card - Overlaid */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="max-w-3xl mx-auto">
                <AnimatedHeaderCard
                  title={projectName}
                  description={projectDescription}
                  projectTechnologies={projectTechnologies}
                  className="bg-white/95 backdrop-blur-sm shadow-xl"
                >
                  <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {projectName}
                    </h1>
                    <p className="text-gray-600">
                      {projectDescription}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {projectTechnologies.map((tech: any) => (
                        <span
                          key={tech.id}
                          className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800"
                        >
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </AnimatedHeaderCard>
              </div>
            </div>
          </div>

          {/* Main Content with Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {blocks.map((block: any) => (
                <div key={block.id} className="mb-6">
                  {renderBlock(block)}
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Interest Button */}
                <div className="mb-6">
                  <InterestButton 
                    project={{
                      id: page.id,
                      name: page.properties.Name.title[0]?.plain_text,
                      imageUrl: page.cover?.external?.url || page.cover?.file?.url,
                      shortDescription: page.properties['Short Description']?.rich_text[0]?.plain_text,
                      longDescription: page.properties.Description?.rich_text[0]?.plain_text,
                      type: page.properties.Type?.select?.name,
                      tags: page.properties.Technologies?.multi_select || [],
                      slug: page.properties.Slug?.rich_text[0]?.plain_text || page.id
                    }} 
                  />
                </div>

                {/* Table of Contents */}
                <TableOfContents headings={headings} />
              </div>
            </div>
          </div>

          {/* Related Projects Section - Bottom */}
          <div className="mt-16 border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.map((project: any) => (
                <RelatedProjectCard
                  key={project.id}
                  project={project}
                  className="h-full" // Make cards equal height
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading project:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error Loading Project</h2>
          <p className="text-red-600">
            There was an error loading the project. Please try again later.
          </p>
      </div>
    </div>
  );
  }
}