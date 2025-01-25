import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import NotionBlockRenderer from '@/components/NotionBlockRenderer'

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  try {
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', params.slug)
      .single()

    if (error || !project) {
      redirect('/404')
    }

    return (
      <main className="container mx-auto py-8">
        <NotionBlockRenderer block={project.content} />
      </main>
    )
  } catch (error) {
    console.error('Error fetching project:', error)
    redirect('/404')
  }
} 