import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  provider: string | null;
  created_at?: string;
  updated_at?: string;
}

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  async signInWithGoogle(): Promise<void> {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      console.error('Google OAuth error:', error.message);
    }
  }

  async signInWithApple(): Promise<void> {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      console.error('Apple OAuth error:', error.message);
    }
  }

  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
  }

  async getSession() {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) {
      console.error('Session error:', error.message);
      return null;
    }
    return data.session;
  }

  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) {
      return null;
    }
    return data.user;
  }

  async handleAuthCallback(): Promise<void> {
    const { data: { session }, error } = await this.supabase.auth.getSession();
    if (error || !session?.user) {
      return;
    }
    const provider = session.user?.app_metadata?.provider as string | null;
    await this.upsertProfile(session.user, provider);
  }

  private async upsertProfile(user: User, provider: string | null): Promise<void> {
    const profile: Profile = {
      id: user.id,
      email: user.email ?? null,
      full_name: user.user_metadata?.['full_name'] ?? user.user_metadata?.['name'] ?? null,
      avatar_url: user.user_metadata?.['avatar_url'] ?? user.user_metadata?.['picture'] ?? null,
      provider,
    };

    const { error } = await this.supabase.from('profiles').upsert(profile, {
      onConflict: 'id',
      ignoreDuplicates: false,
    });

    if (error) {
      console.warn('Profile upsert skipped — ensure a "profiles" table exists in Supabase:', error.message);
    }
  }
}
