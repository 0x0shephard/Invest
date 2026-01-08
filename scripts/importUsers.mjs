import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- START CONFIGURATION ---

// !! USE YOUR SERVICE ROLE KEY, NOT THE ANON KEY !!
const SUPABASE_URL = "https://ntsyahumitpzpdvzlrae.supabase.co";
//
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50c3lhaHVtaXRwenBkdnpscmFlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzg4NzgxNiwiZXhwIjoyMDgzNDYzODE2fQ.B81sybvV30Kzn61nztEP5xw8K3AmyP6RWTtRXrXtNzI"; 


const usersFilePath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../users.json');

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY);

async function createUsers() {
  try {
    const fileContent = fs.readFileSync(usersFilePath, 'utf8');
    const root = JSON.parse(fileContent);
    const users = root.users; // Correctly access the array in users.json

    console.log(`Importing ${users.length} users...`);

    for (const user of users) {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        user_metadata: { 
          username: user.username,
          role: 'player' 
        },
        email_confirm: true 
      });

      if (error) {
        console.error(`Error for ${user.email}: ${error.message}`);
      } else {
        console.log(`Success: ${user.email}`);
      }
    }
    console.log('Import finished.');
  } catch (err) {
    console.error("Critical error:", err);
  }
}

createUsers();