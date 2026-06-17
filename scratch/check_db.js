import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nliaslftsujgvuwwnltx.supabase.co';
const supabaseKey = 'sb_publishable_8nf5F6AswpjFyXxbGv12TQ_VMiQsi28';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Fetching first Women product...");
  const { data: womenProducts, error } = await supabase.from('products').select('*').eq('gender_category', 'Women').limit(5);
  if (error) {
    console.error("Error:", error);
    return;
  }
  console.log("Found Women Products count:", womenProducts.length);
  womenProducts.forEach((p, idx) => {
    console.log(`Product ${idx + 1}:`, JSON.stringify(p, null, 2));
  });
}

main();
