import { Injectable, signal } from '@angular/core';
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

  currentUser = signal<User | null>(null);
  profile = signal<Profile | null>(null);
  showEditProfile = signal(false);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });

    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        const user = session?.user ?? null;
        this.currentUser.set(user);
        if (user) {
          const provider = user.app_metadata?.provider as string | null;
          this.upsertProfile(user, provider);
          this.getProfile();
        }
      } else if (event === 'SIGNED_OUT') {
        this.currentUser.set(null);
        this.profile.set(null);
      }
    });

    this.supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        this.currentUser.set(session.user);
        const provider = session.user.app_metadata?.provider as string | null;
        this.upsertProfile(session.user, provider);
        this.getProfile();
      }
    });
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  async signInWithGoogle(): Promise<void> {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });
    if (error) {
      console.error('Google OAuth error:', error.message);
    }
  }

  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
    this.currentUser.set(null);
    this.profile.set(null);
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
    } else {
      this.profile.set(profile);
    }
  }

  async getProfile(): Promise<Profile | null> {
    const user = this.currentUser();
    if (!user) return null;

    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.warn('Error fetching profile:', error.message);
      return null;
    }

    this.profile.set(data);
    return data;
  }

  async updateProfile(updates: Partial<Profile>): Promise<void> {
    const user = this.currentUser();
    if (!user) return;

    const { error } = await this.supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error.message);
      throw error;
    }

    await this.getProfile();
  }
}
