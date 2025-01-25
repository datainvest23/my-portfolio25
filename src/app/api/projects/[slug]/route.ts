import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = await createClient()
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', params.slug)
      .single()

    if (error || !project) {
      return new NextResponse('Project not found', { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
} 