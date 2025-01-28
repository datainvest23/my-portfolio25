import { getProjectBySlug, getBlocks, getRelatedProjects } from '@/lib/notion';
import { createClient } from '@/utils/supabase/server';
import { InterestButton } from '@/components/InterestButton';
import RelatedProjectCard from '@/components/RelatedProjectCard';
import TableOfContents from '@/components/TableOfContents';
import { redirect, notFound } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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
      return (
        <p key={id} className="mb-4 text-gray-700 leading-relaxed">
          {value.rich_text.map((text: any, i: number) => renderText(text, i))}
        </p>
      );
    case 'heading_1':
      return (
        <h1 key={id} className="text-3xl font-bold mb-6 mt-8">
          {value.rich_text.map((text: any, i: number) => renderText(text, i))}
        </h1>
      );
    case 'heading_2':
      return (
        <h2 key={id} className="text-2xl font-semibold mb-4 mt-6">
          {value.rich_text.map((text: any, i: number) => renderText(text, i))}
        </h2>
      );
    case 'heading_3':
      return (
        <h3 key={id} className="text-xl font-medium mb-3 mt-5">
          {value.rich_text.map((text: any, i: number) => renderText(text, i))}
        </h3>
      );
    case 'bulleted_list_item':
      return (
        <li key={id} className="ml-6 mb-2 text-gray-700">
          {value.rich_text.map((text: any, i: number) => renderText(text, i))}
        </li>
      );
    case 'numbered_list_item':
      return (
        <li key={id} className="ml-6 mb-2 text-gray-700">
          {value.rich_text.map((text: any, i: number) => renderText(text, i))}
        </li>
      );
    case 'code':
      return (
        <pre key={id} className="bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
          <code className={`language-${value.language || 'plain'}`}>
            {value.rich_text[0]?.plain_text || ''}
          </code>
        </pre>
      );
    case 'image':
      const src = value.type === 'external' ? value.external.url : value.file.url;
      const caption = value.caption?.length ? value.caption[0]?.plain_text : '';
      return (
        <figure key={id} className="my-6">
          <Image
            src={src}
            alt={caption || 'Project image'}
            width={800}
            height={500}
            className="rounded-lg"
          />
          {caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    case 'embed':
      return (
        <div key={id} className="my-6">
          <iframe
            src={value.url}
            className="w-full min-h-[400px] rounded-lg border"
            allowFullScreen
          />
        </div>
      );
    default:
      console.log(`⚠️ Unhandled block type: ${type}`, block);
      return null;
  }
}

// Helper function to render rich text with formatting
function renderText(text: any, i: number) {
  const {
    annotations: { bold, code, color, italic, strikethrough, underline },
    text: { content, link }
  } = text;

  const className = cn(
    bold && "font-bold",
    code && "bg-gray-100 px-1 py-0.5 rounded font-mono text-sm",
    italic && "italic",
    strikethrough && "line-through",
    underline && "underline",
    color !== "default" && `text-${color}`
  );

  if (link) {
    return (
      <a 
        key={i}
        href={link.url}
        className={cn(className, "text-blue-600 hover:underline")}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return content.length ? (
    <span key={i} className={className}>
      {content}
    </span>
  ) : null;
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
              <article className="prose prose-lg max-w-none prose-headings:font-work-sans prose-p:text-gray-600">
                {blocks.map((block: any) => (
                  <div key={block.id} className="mb-6">
                    {renderBlock(block)}
                  </div>
                ))}
              </article>
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
