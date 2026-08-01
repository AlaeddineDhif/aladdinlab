import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private supabaseService = inject(SupabaseService);
  protected supabase = this.supabaseService;

  dropdownOpen = signal(false);
  authLoading = signal(false);
  mobileOpen = signal(false);

  avatarUrl = computed(() => {
    return this.supabase.profile()?.avatar_url
      ?? this.supabase.currentUser()?.user_metadata?.['picture']
      ?? '';
  });

  toggleDropdown(): void {
    this.dropdownOpen.update(v => !v);
  }

  closeDropdown(): void {
    this.dropdownOpen.set(false);
  }

  toggleMobile(): void {
    this.mobileOpen.update(v => !v);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }

  async loginWithGoogle(): Promise<void> {
    this.authLoading.set(true);
    await this.supabase.signInWithGoogle();
    this.authLoading.set(false);
  }

  editProfile(): void {
    this.dropdownOpen.set(false);
    this.supabase.showEditProfile.set(true);
  }

  signOut(): void {
    this.dropdownOpen.set(false);
    this.supabase.signOut();
  }
}
