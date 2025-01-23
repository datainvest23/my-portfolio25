"use client";

import { useEffect, useState } from 'react';
import { useSupabase } from '@/providers/SupabaseProvider';
import type { Database } from '@/types/supabase';

type Row = Database['public']['Tables']['your_table']['Row'];

export function DataFetcher() {
  const supabase = useSupabase();
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('your_table')
          .select('*');

        if (error) throw error;
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  // ... rest of component
} 