import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">Aladdin's<span class="footer-logo-accent"> Lab</span></div>
          <p class="footer-tagline">Design &amp; Code Laboratory</p>
        </div>

        <div class="footer-nav">
          <span class="footer-heading">Navigation</span>
          <a href="#">Home</a>
          <a href="#">Work With Me</a>
        </div>

        <div class="footer-social">
          <span class="footer-heading">Connect</span>
          <a href="mailto:contact@aladdinslab.com" class="footer-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            contact&#64;aladdinslab.com
          </a>
          <a href="https://www.instagram.com/aladdin_lab/" target="_blank" rel="noopener noreferrer" class="footer-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            Instagram
          </a>
          <a href="https://www.youtube.com/@AladdinLab_25" target="_blank" rel="noopener noreferrer" class="footer-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
            YouTube
          </a>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container">
          <span class="footer-copy">&copy; 2026 Aladdin's Lab. All rights reserved.</span>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--surface);
      border-top: 1px solid var(--border);
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1.5fr;
      gap: 40px;
      padding: 56px 0 48px;
    }

    .footer-logo {
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: -.03em;
      color: var(--text);
    }
    .footer-logo-accent { color: var(--accent); }

    .footer-tagline {
      font-size: .78rem;
      color: var(--text-secondary);
      margin-top: 6px;
      opacity: .6;
    }

    .footer-heading {
      font-size: .65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .15em;
      color: var(--text-secondary);
      opacity: .4;
      margin-bottom: 16px;
      display: block;
    }

    .footer-nav {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .footer-nav a {
      font-size: .85rem;
      font-weight: 500;
      color: var(--text-secondary);
      transition: color var(--transition);
    }
    .footer-nav a:hover { color: var(--accent); }

    .footer-social {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .footer-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: .85rem;
      font-weight: 500;
      color: var(--text-secondary);
      transition: color var(--transition);
    }
    .footer-link svg {
      flex-shrink: 0;
      opacity: .5;
      transition: opacity var(--transition);
    }
    .footer-link:hover { color: var(--accent); }
    .footer-link:hover svg { opacity: 1; }

    .footer-bottom {
      border-top: 1px solid var(--border);
      padding: 20px 0;
    }
    .footer-copy {
      font-size: .75rem;
      color: var(--text-secondary);
      opacity: .4;
    }

    @media (max-width: 768px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 32px;
        padding: 40px 0 32px;
      }
      .footer-nav, .footer-social { align-items: flex-start; }
    }
  `]
})
export class FooterComponent {}
