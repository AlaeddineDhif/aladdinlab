import { Component } from '@angular/core';

@Component({
  selector: 'app-audience-portal',
  standalone: true,
  template: `
    <section id="portal" class="portal">
      <div class="container">
        <div class="portal-header">
          <h2 class="portal-title">Explore Aladdin's Lab</h2>
          <p class="portal-desc">
            Whether you are here to learn making or scale your hardware business, we have a place for you.
          </p>
        </div>

        <div class="portal-cards">
          <div class="portal-card portal-card--maker">
            <div class="card-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="1.5" opacity="0.2"/>
                <path d="M20 16v16l14-8-14-8z" fill="currentColor" opacity="0.9"/>
                <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.15"/>
              </svg>
            </div>
            <span class="card-badge">Community</span>
            <h3 class="card-title">The Maker Corner</h3>
            <p class="card-text">
              Access open-source schematics, firmware repositories, 3D printing tutorials, and join a network of 2,000+ tech builders.
            </p>
            <a href="#" class="card-cta card-cta--outline">Join the Community</a>
          </div>

          <div class="portal-card portal-card--enterprise">
            <div class="card-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="10" y="10" width="28" height="28" rx="4" stroke="currentColor" stroke-width="1.5"/>
                <rect x="14" y="14" width="20" height="16" rx="1" fill="currentColor" opacity="0.1"/>
                <path d="M18 30v4a2 2 0 01-2 2h-2M30 30v4a2 2 0 002 2h2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                <rect x="20" y="16" width="8" height="2" rx="1" fill="currentColor" opacity="0.5"/>
                <rect x="20" y="20" width="8" height="2" rx="1" fill="currentColor" opacity="0.5"/>
                <rect x="20" y="24" width="5" height="2" rx="1" fill="currentColor" opacity="0.5"/>
                <circle cx="24" cy="34" r="2" fill="currentColor" opacity="0.3"/>
                <path d="M34 20l4-2M34 28l4 2M14 20l-4-2M14 28l-4 2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/>
              </svg>
            </div>
            <span class="card-badge">Business</span>
            <h3 class="card-title">Enterprise Solutions & R&D</h3>
            <p class="card-text">
              Need rapid prototyping, embedded systems design (IoT/ESP32/STM32), or mechanical automation? Let's bring your hardware product to life.
            </p>
            <a href="#" class="card-cta card-cta--solid">Request Consultation</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .portal {
      padding: clamp(48px, 8vw, 120px) 0;
      background: var(--primary);
      position: relative;
      overflow: hidden;
    }

    .portal::before {
      content: '';
      position: absolute;
      top: -30%;
      left: 50%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
      transform: translateX(-50%);
      pointer-events: none;
      opacity: 0.4;
    }

    .portal-header {
      text-align: center;
      max-width: 700px;
      margin: 0 auto clamp(36px, 5vw, 64px);
      position: relative;
      z-index: 1;
    }

    .portal-title {
      font-size: clamp(1.6rem, 4vw, 2.6rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--text);
      transition: color var(--transition);
    }

    .portal-desc {
      margin-top: clamp(8px, 1.5vw, 16px);
      font-size: clamp(0.9rem, 1.5vw, 1.1rem);
      color: var(--text-secondary);
      line-height: 1.7;
      transition: color var(--transition);
    }

    .portal-cards {
      display: flex;
      gap: clamp(20px, 3vw, 40px);
      position: relative;
      z-index: 1;
    }

    .portal-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: clamp(28px, 3vw, 44px);
      box-shadow: var(--card-shadow);
      transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                  box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                  border-color var(--transition);
      position: relative;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }

    .portal-card:hover {
      transform: scale(1.02);
      border-color: var(--accent);
      box-shadow: 0 0 30px var(--accent-glow);
    }

    .portal-card--enterprise {
      background: var(--surface);
    }

    .card-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: var(--radius-sm);
      background: var(--surface-alt);
      color: var(--accent);
      margin-bottom: clamp(14px, 1.5vw, 22px);
      transition: background var(--transition), color var(--transition);
    }

    .portal-card:hover .card-icon {
      background: var(--accent-glow);
      color: var(--accent);
    }

    .card-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: clamp(0.65rem, 0.9vw, 0.75rem);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 4px 10px;
      border-radius: 20px;
      margin-bottom: clamp(10px, 1.2vw, 16px);
      width: fit-content;
    }

    .portal-card--maker .card-badge {
      color: var(--accent);
      background: var(--accent-glow);
      border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
    }

    .portal-card--enterprise .card-badge {
      color: var(--gold);
      background: color-mix(in srgb, var(--gold) 12%, transparent);
      border: 1px solid color-mix(in srgb, var(--gold) 25%, transparent);
    }

    .card-title {
      font-size: clamp(1.15rem, 2vw, 1.45rem);
      font-weight: 700;
      color: var(--text);
      margin-bottom: clamp(8px, 1vw, 12px);
      line-height: 1.3;
      transition: color var(--transition);
    }

    .card-text {
      font-size: clamp(0.82rem, 1.2vw, 0.92rem);
      color: var(--text-secondary);
      line-height: 1.75;
      margin-bottom: clamp(20px, 2.5vw, 32px);
      flex: 1;
      transition: color var(--transition);
    }

    .card-cta {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: clamp(11px, 1.3vw, 15px) clamp(24px, 3.5vw, 40px);
      border-radius: var(--radius-sm);
      font-weight: 600;
      font-size: clamp(0.85rem, 1.2vw, 0.95rem);
      cursor: pointer;
      text-decoration: none;
      transition: all var(--transition);
      width: fit-content;
    }

    .card-cta--outline {
      background: transparent;
      color: var(--accent);
      border: 1.5px solid var(--accent);
    }

    .card-cta--outline:hover {
      background: var(--accent);
      color: #fff;
      box-shadow: 0 0 24px var(--accent-glow);
      transform: translateY(-2px);
    }

    .card-cta--solid {
      background: var(--accent);
      color: #fff;
      border: 1.5px solid var(--accent);
    }

    .card-cta--solid:hover {
      background: var(--accent-hover);
      border-color: var(--accent-hover);
      box-shadow: 0 0 24px var(--accent-glow);
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .portal-cards {
        flex-direction: column;
      }

      .portal-card:hover {
        transform: scale(1.01);
      }
    }

    @media (max-width: 480px) {
      .portal {
        padding: 40px 0;
      }

      .portal-card {
        padding: 24px;
      }

      .card-cta {
        width: 100%;
        justify-content: center;
      }
    }

    @media (min-width: 1600px) {
      .portal {
        padding: 140px 0;
      }

      .portal-cards {
        gap: 48px;
      }

      .portal-card {
        padding: 48px;
      }
    }
  `]
})
export class AudiencePortalComponent {}
