import { createClient } from '@supabase/supabase-js';
import { configs } from './';

const url = configs.serverApi.supabaseUrl as string
const key = configs.serverApi.supabaseAnonKey as string

export const supabase = createClient(url, key);
