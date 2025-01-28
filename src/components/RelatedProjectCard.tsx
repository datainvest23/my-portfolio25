import Link from 'next/link';
import Image from 'next/image';

interface RelatedProjectCardProps {
  project: {
    title: string;
    shortDescription: string;
    imageUrl: string;
    slug: string;
    type: string;
    tags: Array<{ id: string; name: string; }>;
  };
}

export default function RelatedProjectCard({ project }: RelatedProjectCardProps) {
  const { title, shortDescription, imageUrl, slug, type, tags } = project;

  return (
    <Link href={`/project/${slug}`} className="group">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative aspect-video">
          <Image
            src={imageUrl || '/placeholder.jpg'}
            alt={title}
            fill
            className="object-cover"
          />
          {type && (
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-black/70 text-white">
                {type}
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {shortDescription}
          </p>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
} 