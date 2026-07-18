import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

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

        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Home</a>
          <a routerLink="/work-with-me" routerLinkActive="active" class="nav-link">Work With Me</a>
        </nav>
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
export class NavbarComponent {}
