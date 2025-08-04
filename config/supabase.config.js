const { createClient } = require('@supabase/supabase-js');
const serviceAccount = {
  project_url: process.env.project_url,
  service_role_key: process.env.service_role_key,
  anon_key: process.env.anon_key,
  bucket: process.env.bucket,
  description: process.env.description
}


const supabase = createClient(
  serviceAccount.project_url,
  serviceAccount.service_role_key
);

const bucket = supabase.storage.from(serviceAccount.bucket);

module.exports = { supabase, bucket };
