const { createClient } = require('@supabase/supabase-js');
const serviceAccount = require('../supabase-service-account.json');

const supabase = createClient(
  serviceAccount.project_url,
  serviceAccount.service_role_key
);

const bucket = supabase.storage.from(serviceAccount.bucket);

module.exports = { supabase, bucket };
