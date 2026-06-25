import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nliaslftsujgvuwwnltx.supabase.co';
const supabaseKey = 'sb_publishable_8nf5F6AswpjFyXxbGv12TQ_VMiQsi28';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable(tableName) {
  try {
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: false })
      .limit(3);
    
    if (error) {
      console.log(`Table "${tableName}" check failed/not found:`, error.message);
      return false;
    } else {
      console.log(`Table "${tableName}" exists! Row count: ${count}`);
      console.log(`Sample rows:`, JSON.stringify(data, null, 2));
      return true;
    }
  } catch (e) {
    console.log(`Table "${tableName}" threw error:`, e.message);
    return false;
  }
}

async function run() {
  const tables = ['products', 'profiles', 'orders', 'coupons', 'notifications', 'messages', 'transactions', 'reviews', 'wishlist'];
  for (const table of tables) {
    console.log(`\n--- Checking ${table} ---`);
    await checkTable(table);
  }
}

run();
