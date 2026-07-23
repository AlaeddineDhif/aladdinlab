import { Component, signal, inject, computed } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  private supabaseService = inject(SupabaseService);
  protected supabase = this.supabaseService;

  isDark = signal(document.body.classList.contains('dark-theme'));
  authLoading = signal(false);

  user = computed(() => this.supabase.currentUser());
  profile = computed(() => this.supabase.profile());

  displayName = computed(() => {
    const p = this.profile();
    if (p?.full_name) return p.full_name;
    const u = this.user();
    return u?.user_metadata?.['full_name'] ?? u?.user_metadata?.['name'] ?? u?.email ?? 'Member';
  });

  toggleTheme(): void {
    this.isDark.update(v => !v);
    document.body.classList.toggle('dark-theme');
  }

  async loginWithGoogle(): Promise<void> {
    this.authLoading.set(true);
    await this.supabase.signInWithGoogle();
    this.authLoading.set(false);
  }

  openEditProfile(): void {
    this.supabase.showEditProfile.set(true);
  }
}
