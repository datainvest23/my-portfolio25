import Link from 'next/link';
import Image from 'next/image';

interface RelatedProjectCardProps {
  project: any;
  className?: string;
}

export default function RelatedProjectCard({ project, className = '' }: RelatedProjectCardProps) {
  const projectName = project.properties.Name.title[0]?.plain_text;
  const projectSlug = project.properties.Slug.rich_text[0]?.plain_text;
  const description = project.properties['Short Description']?.rich_text[0]?.plain_text;
  const technologies = project.properties.Technologies?.multi_select || [];

  return (
    <Link href={`/project/${projectSlug}`}>
      <div className={`group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg ${className}`}>
        <div className="aspect-[16/9] relative">
          {/* Cover Image */}
          {project.cover?.external?.url ? (
            <>
              <Image 
                src={project.cover.external.url} 
                alt={projectName || 'Project cover'}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Permanent Dark Overlay */}
              <div className="absolute inset-0 bg-black/40" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
          )}

          {/* Technologies Tags - Now at the top */}
          {technologies.length > 0 && (
            <div className="absolute top-0 left-0 right-0 p-3 flex flex-wrap gap-1 bg-gray-900/80 backdrop-blur-sm">
              {technologies.slice(0, 3).map((tech: any) => (
                <span
                  key={tech.id}
                  className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-white"
                >
                  {tech.name}
                </span>
              ))}
              {technologies.length > 3 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-white">
                  +{technologies.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Content Container - At the bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-black/60">
            {/* Project Title */}
            <h3 className="font-medium text-sm sm:text-base lg:text-lg text-white line-clamp-2 leading-tight">
              {projectName}
            </h3>
            
            {/* Description - Only shows on hover */}
            {description && (
              <p className="text-xs sm:text-sm text-gray-200 mt-1 line-clamp-2 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
} 