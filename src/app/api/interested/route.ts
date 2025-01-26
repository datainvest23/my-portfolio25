import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

    const { data: userInterests, error } = await supabase
      .from('user_interests')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user interests:', error);
      return NextResponse.json({ error: 'Failed to load interested items' }, { status: 500 });
    }

      return NextResponse.json({ interests: userInterests }, { status: 200 })

  } catch (error) {
    console.error('Error in GET /api/interested:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient()

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is missing' }, { status: 400 });
    }

    const { error } = await supabase
      .from('user_interests')
      .delete()
      .eq('id', itemId);

    if (error) {
        console.error('Error deleting item:', error);
      return NextResponse.json(
          { error: 'Failed to remove item' },
          { status: 500 }
        );
    }

      return NextResponse.json({ success: true }, { status: 200 })
    
  } catch (error) {
    console.error('Error in DELETE /api/interested:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}