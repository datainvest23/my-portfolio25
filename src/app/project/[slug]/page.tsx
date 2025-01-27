import { getProjectBySlug, getBlocks, getRelatedProjects } from '@/lib/notion';
import { createClient } from '@/utils/supabase/server';
import { InterestButton } from '@/components/InterestButton';
import RelatedProjectCard from '@/components/RelatedProjectCard';
import TableOfContents from '@/components/TableOfContents';
import { redirect, notFound } from 'next/navigation';
import Image from 'next/image';

interface PageProps {
  params: {
    slug: string;
  };
}

// Helper function to render each Notion block
function renderBlock(block: any) {
  const { type, id } = block;
  const value = block[type];

  switch (type) {
                case 'paragraph':
      return <p key={id}>{value.rich_text[0]?.plain_text}</p>;
                case 'heading_1':
      return <h1 key={id}>{value.rich_text[0]?.plain_text}</h1>;
                case 'heading_2':
      return <h2 key={id}>{value.rich_text[0]?.plain_text}</h2>;
                case 'heading_3':
      return <h3 key={id}>{value.rich_text[0]?.plain_text}</h3>;
    case 'bulleted_list_item':
                  return (
        <ul key={id}>
          <li>{value.rich_text[0]?.plain_text}</li>
        </ul>
      );
    case 'numbered_list_item':
      return (
        <ol key={id}>
          <li>{value.rich_text[0]?.plain_text}</li>
        </ol>
      );
    case 'image':
      const src =
        value.type === 'external' ? value.external.url : value.file.url;
      return <img key={id} src={src} alt="Notion Image" />;
    default:
      console.log(`❌ Unsupported block type: ${type}`);
      return null;
  }
}

// Helper function to extract headings for the Table of Contents
function extractHeadings(blocks: any[]) {
  if (!blocks || !Array.isArray(blocks)) {
    return [];
  }

  return blocks
    .filter((block: any) => block.type === 'heading_2' || block.type === 'heading_3')
    .map((block: any) => ({
      id: block.id,
      text: block[block.type]?.rich_text[0]?.plain_text || 'Untitled',
      level: parseInt(block.type.slice(-1)),
    }));
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = params;

  try {
    // Authenticate with Supabase
    const supabase = await createClient();
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      redirect('/login');
    }

    // Fetch project metadata from Notion
    const project = await getProjectBySlug(process.env.NOTION_DATABASE_ID!, slug);
    if (!project) {
      notFound();
    }

    // Debugging: Log the project object
    console.log('Notion Project Object:', JSON.stringify(project, null, 2));

    const blocks = await getBlocks(project.id); // Fetch all blocks
    const headings = extractHeadings(blocks); // Extract headings for the TOC
    const relatedProjects = await getRelatedProjects(process.env.NOTION_DATABASE_ID!, slug);

    // Safely access project properties
    const projectName = project.properties?.Name?.title[0]?.plain_text || 'Untitled';
    const projectDescription =
      project.properties?.['Short Description']?.rich_text[0]?.plain_text || 'No description available.';
    const projectTechnologies = project.properties?.Technologies?.multi_select || [];
    const projectCover =
      project.cover?.external?.url || project.cover?.file?.url || null;

                  return (
      <div className="container mx-auto px-4 py-8">
        {/* Main Content */}
        <div className="relative mb-8">
          {projectCover && (
            <div className="relative h-[300px] mb-8">
              <Image
                src={projectCover}
                alt={projectName || 'Project cover'}
                fill
                className="object-cover rounded-lg"
                priority
              />
              </div>
            )}
          <div className="mt-6">
            <h1 className="text-4xl font-bold mb-4">{projectName}</h1>
            <p className="text-lg text-gray-600">{projectDescription}</p>
            <div className="flex flex-wrap mt-4 gap-2">
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {blocks.map((block: any) => (
                <div key={block.id} className="mb-6">
                  {renderBlock(block)}
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
            <TableOfContents headings={headings} />
                  <InterestButton 
                    project={{
                id: project.id,
                name: projectName,
                imageUrl: projectCover,
                shortDescription: projectDescription,
                type: project.properties?.Type?.select?.name,
                tags: projectTechnologies,
                slug,
              }}
            />
            </div>
          </div>

        {/* Related Projects Section */}
          <div className="mt-16 border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProjects.map((related) => (
              <RelatedProjectCard key={related.id} project={related} />
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading project:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">Error loading project. Please try again later.</p>
    </div>
  );
  }
}
