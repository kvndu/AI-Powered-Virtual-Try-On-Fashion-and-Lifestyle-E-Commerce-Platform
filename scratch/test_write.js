import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nliaslftsujgvuwwnltx.supabase.co';
const supabaseKey = 'sb_publishable_8nf5F6AswpjFyXxbGv12TQ_VMiQsi28';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const newProduct = {
    name: 'TEST INSERT PRODUCT',
    gender_category: 'Women',
    subcategory: 'Test Dress',
    price_lkr: 9999,
    images_array: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=150&auto=format&fit=crop&q=60']
  };

  console.log("Attempting insert...");
  const { data, error } = await supabase.from('products').insert([newProduct]).select();
  if (error) {
    console.error("Insert failed:", error.message);
  } else {
    console.log("Insert succeeded!", data);
    
    console.log("Attempting delete of inserted row...");
    const { error: delError } = await supabase.from('products').delete().eq('id', data[0].id);
    if (delError) {
      console.error("Delete failed:", delError.message);
    } else {
      console.log("Delete succeeded!");
    }
  }
}
run();
