import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nliaslftsujgvuwwnltx.supabase.co';
const supabaseKey = 'sb_publishable_8nf5F6AswpjFyXxbGv12TQ_VMiQsi28';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('products').select('*').limit(1);
  if (error) {
    console.error(error);
  } else if (data && data.length > 0) {
    console.log("Keys in product:", Object.keys(data[0]));
    console.log("Full product:", data[0]);
  } else {
    console.log("No products found.");
  }
}
run();
