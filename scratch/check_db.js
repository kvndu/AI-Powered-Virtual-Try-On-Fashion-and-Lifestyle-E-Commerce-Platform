import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nliaslftsujgvuwwnltx.supabase.co';
const supabaseKey = 'sb_publishable_8nf5F6AswpjFyXxbGv12TQ_VMiQsi28';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('products').select('gender_category, subcategory');
  if (error) {
    console.error(error);
  } else {
    const genderCategories = {};
    data.forEach(p => {
      const gc = p.gender_category;
      const sub = p.subcategory;
      if (!genderCategories[gc]) {
        genderCategories[gc] = new Set();
      }
      if (sub) {
        genderCategories[gc].add(sub);
      }
    });

    console.log("Distinct gender categories and their subcategories:");
    for (const [gc, subs] of Object.entries(genderCategories)) {
      console.log(`\nGender Category: "${gc}"`);
      console.log("Subcategories:", Array.from(subs));
    }
  }
}
run();
