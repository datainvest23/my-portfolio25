// src/app/project/[slug]/page.tsx
import { getDatabase, getBlocks } from '@/lib/notion';
import { TableOfContents } from '@/components/TableOfContents';
import { RelatedProjectCard } from '@/components/RelatedProjectCard';
import { InterestButton } from '@/components/InterestButton';
import { AnimatedHeaderCard } from '@/components/AnimatedHeaderCard';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { NotionBlock } from '@/types/notion';

function renderBlock(block: NotionBlock) {
  const { type, id } = block;

  switch (type) {
    case 'paragraph':
      if (!block.paragraph?.rich_text?.length) return null;
      return (
        <p className="mb-4">
          {block.paragraph.rich_text.map((text, i) => (
            <span key={i}>{text.plain_text}</span>
          ))}
        </p>
      );

    case 'heading_1':
      if (!block.heading_1?.rich_text?.length) return null;
      return (
        <h1 id={id} className="text-3xl font-bold mb-4 mt-8">
          {block.heading_1.rich_text[0].plain_text}
        </h1>
      );

    case 'heading_2':
      if (!block.heading_2?.rich_text?.length) return null;
      return (
        <h2 id={id} className="text-2xl font-bold mb-3 mt-6">
          {block.heading_2.rich_text[0].plain_text}
        </h2>
      );

    case 'heading_3':
      if (!block.heading_3?.rich_text?.length) return null;
      return (
        <h3 id={id} className="text-xl font-semibold mb-2 mt-4">
          {block.heading_3.rich_text[0].plain_text}
        </h3>
      );

    case 'bulleted_list_item':
      if (!block.bulleted_list_item?.rich_text?.length) return null;
      return (
        <li className="ml-6 mb-1 list-disc">
          {block.bulleted_list_item.rich_text.map((text, i) => (
            <span key={i}>{text.plain_text}</span>
          ))}
        </li>
      );

    case 'numbered_list_item':
      if (!block.numbered_list_item?.rich_text?.length) return null;
      return (
        <li className="ml-6 mb-1 list-decimal">
          {block.numbered_list_item.rich_text.map((text, i) => (
            <span key={i}>{text.plain_text}</span>
          ))}
        </li>
      );

    case 'code':
      if (!block.code?.rich_text?.length) return null;
      return (
        <pre className="bg-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">
          <code>
            {block.code.rich_text.map((text, i) => (
              <span key={i}>{text.plain_text}</span>
            ))}
          </code>
        </pre>
      );

    case 'image':
      const imageUrl = block.image?.type === 'external' 
        ? block.image.external?.url 
        : block.image.file?.url;

      if (!imageUrl) return null;

      return (
        <div className="my-4">
          <Image
            src={imageUrl}
            alt={block.image.caption?.[0]?.plain_text || 'Project image'}
            width={800}
            height={400}
            className="rounded-lg"
          />
          {block.image.caption?.[0]?.plain_text && (
            <p className="text-sm text-gray-500 mt-2">
              {block.image.caption[0].plain_text}
            </p>
          )}
        </div>
      );

    default:
      console.warn('❌ Unsupported block type:', type);
      return null;
  }
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ProjectPage({ params }: PageProps) {
  try {
    // Await params.slug
    const slug = await Promise.resolve(params.slug);
    const database = await getDatabase(process.env.NOTION_DATABASE_ID!);
    
    const page = database.find((page) => {
      return page.properties.Slug.rich_text[0]?.plain_text === slug;
    });

    if (!page) {
      notFound();
    }

    const blocks = await getBlocks(page.id);

    // Extract headings for table of contents
    const headings = blocks
      .filter(block => block.type === 'heading_2' || block.type === 'heading_3')
      .map(block => ({
        id: block.id,
        text: block[block.type].rich_text[0].plain_text,
        level: parseInt(block.type.slice(-1))
      }));

    // Get related projects (same type)
    const relatedProjects = database
      .filter(p => 
        p.id !== page.id && 
        p.properties.Type.select?.name === page.properties.Type.select?.name
      )
      .slice(0, 3);

    return (
      <div>
        <AnimatedHeaderCard
          projectName={page.properties.Name.title[0].plain_text}
          projectDescription={page.properties['Short Description'].rich_text[0].plain_text}
          projectTechnologies={page.properties.Technologies.multi_select}
        >
          <InterestButton projectId={page.id} />
        </AnimatedHeaderCard>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {blocks.map((block) => (
                <div key={block.id}>
                  {renderBlock(block)}
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <TableOfContents headings={headings} />
              </div>
            </div>
          </div>

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">Related Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProjects.map((project) => (
                  <RelatedProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading project:', error);
    return <div>Failed to load project</div>;
  }
}