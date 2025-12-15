import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private configService: ConfigService) { }

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    // Use service role key for backend operations (bypasses RLS)
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)');
    }

    this.logger.log('Initializing Supabase with service role key');
    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  // Shorthand for common operations
  from(table: string) {
    return this.supabase.from(table);
  }

  get auth() {
    return this.supabase.auth;
  }
}
