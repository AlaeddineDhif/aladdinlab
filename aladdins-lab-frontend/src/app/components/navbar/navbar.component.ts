import { Component, inject, signal, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private router = inject(Router);
  protected supabase = inject(SupabaseService);

  dropdownOpen = signal(false);
  authLoading = signal(false);
  mobileOpen = signal(false);

  activeSection: string = 'home';

  avatarUrl = this.supabase.profile()?.avatar_url
    ?? this.supabase.currentUser()?.user_metadata?.['picture']
    ?? '';

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollPos = window.scrollY || document.documentElement.scrollTop;
    const videosEl = document.getElementById('videos');
    const dealsEl = document.getElementById('deals');
    const workEl = document.getElementById('work-with-me');
    const offset = 200;

    if (workEl && scrollPos >= workEl.offsetTop - offset) {
      this.activeSection = 'work-with-me';
    } else if (dealsEl && scrollPos >= dealsEl.offsetTop - offset) {
      this.activeSection = 'deals';
    } else if (videosEl && scrollPos >= videosEl.offsetTop - offset) {
      this.activeSection = 'videos';
    } else {
      this.activeSection = 'home';
    }
  }

  setSection(id: string): void {
    this.activeSection = id;
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

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