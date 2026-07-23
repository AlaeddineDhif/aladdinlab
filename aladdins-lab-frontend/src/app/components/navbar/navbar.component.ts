import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="navbar">
      <div class="container navbar-inner">
        <a routerLink="/" class="logo">
          <img src="assets/logo.png" alt="Aladdin's Lab" class="logo-img" />
          <span class="logo-text">Aladdin's Lab</span>
        </a>

        <div class="navbar-right">
          <nav class="nav-links">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Home</a>
            <a routerLink="/work-with-me" routerLinkActive="active" class="nav-link">Work With Me</a>
            <a routerLink="/3d-printing" routerLinkActive="active" class="nav-link">3d Printing</a>
            <a routerLink="/esp32-projects" routerLinkActive="active" class="nav-link">ESP32 Projects</a>
          </nav>

          @if (supabase.currentUser()) {
            <div class="user-menu">
              <button class="avatar-btn" (click)="toggleDropdown()" [attr.aria-label]="'User menu'">
                <img [src]="avatarUrl()" alt="" class="avatar-img" />
              </button>
              @if (dropdownOpen()) {
                <div class="dropdown-backdrop" (click)="dropdownOpen.set(false)"></div>
                <div class="dropdown-menu">
                  <div class="dropdown-header">
                    <span class="dropdown-name">{{ supabase.profile()?.full_name ?? supabase.currentUser()?.email }}</span>
                    <span class="dropdown-email">{{ supabase.currentUser()?.email }}</span>
                  </div>
                  <hr />
                  <button class="dropdown-item" (click)="editProfile()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Edit Profile
                  </button>
                  <button class="dropdown-item" (click)="closeDropdown()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    Community Hub
                  </button>
                  <hr />
                  <button class="dropdown-item dropdown-item--danger" (click)="signOut()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sign Out
                  </button>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--navbar-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--navbar-border);
      transition: background var(--transition), border-color var(--transition);
    }

    .navbar-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text);
      font-weight: 700;
      font-size: clamp(1.05rem, 2vw, 1.25rem);
      transition: color var(--transition);
    }

    .logo-img {
      height: 32px;
      width: auto;
      display: block;
    }

    .navbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-links {
      display: flex;
      gap: 4px;
    }

    .nav-link {
      padding: 8px 12px;
      border-radius: var(--radius-sm);
      color: var(--navbar-link);
      font-weight: 500;
      font-size: clamp(0.8rem, 1.5vw, 0.875rem);
      transition: all var(--transition);
    }

    .nav-link:hover,
    .nav-link.active {
      color: var(--navbar-link-hover);
      background: var(--navbar-link-bg-hover);
    }

    .user-menu {
      position: relative;
    }

    .avatar-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2px solid var(--border);
      background: var(--surface);
      cursor: pointer;
      overflow: hidden;
      transition: border-color var(--transition);
      padding: 0;
    }

    .avatar-btn:hover {
      border-color: var(--accent);
    }

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .dropdown-backdrop {
      position: fixed;
      inset: 0;
      z-index: 199;
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      z-index: 200;
      min-width: 240px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
    }

    .dropdown-header {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 12px 16px;
    }

    .dropdown-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text);
    }

    .dropdown-email {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .dropdown-menu hr {
      margin: 0;
      border: none;
      border-top: 1px solid var(--border);
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 10px 16px;
      border: none;
      background: none;
      color: var(--text);
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      text-align: left;
      transition: background var(--transition);
    }

    .dropdown-item:hover {
      background: var(--surface-alt);
    }

    .dropdown-item--danger {
      color: var(--danger);
    }

    .dropdown-item svg {
      flex-shrink: 0;
      opacity: 0.7;
    }

    @media (max-width: 480px) {
      .navbar-inner {
        height: 56px;
      }

      .nav-link {
        padding: 6px 10px;
        font-size: 0.8rem;
      }

      .logo-text {
        display: none;
      }
    }

    @media (min-width: 1600px) {
      .logo {
        font-size: 1.35rem;
      }

      .nav-link {
        font-size: 0.95rem;
        padding: 10px 18px;
      }
    }
  `]
})
export class NavbarComponent {
  private supabaseService = inject(SupabaseService);
  protected supabase = this.supabaseService;

  dropdownOpen = signal(false);

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

  editProfile(): void {
    this.dropdownOpen.set(false);
    this.supabase.showEditProfile.set(true);
  }

  signOut(): void {
    this.dropdownOpen.set(false);
    this.supabase.signOut();
  }
}
