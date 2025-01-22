interface AnimatedHeaderCardProps {
  title: string;
  description?: string;
  projectTechnologies: any[];
  children: React.ReactNode;
  className?: string;
}

export function AnimatedHeaderCard({
  title,
  description,
  projectTechnologies,
  children,
  className = ''
}: AnimatedHeaderCardProps) {
  return (
    <div className={`rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
} 