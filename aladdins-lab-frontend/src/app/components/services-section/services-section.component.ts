import { Component } from '@angular/core';

@Component({
  selector: 'app-services-section',
  standalone: true,
  template: `
    <section class="services">
      <div class="container">
        <div class="services-header">
          <h2 class="services-title">Expertise & Services</h2>
          <p class="services-desc">
            From concept to completion — I bring multidisciplinary engineering
            expertise to every project.
          </p>
        </div>

        <div class="services-grid">
          <div class="service-card">
            <div class="card-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="6" y="6" width="28" height="28" rx="4" stroke="currentColor" stroke-width="2"/>
                <path d="M12 12h6v6h-6zM22 12h6v6h-6zM12 22h6v6h-6zM22 22h6v6h-6z" fill="currentColor" opacity="0.4"/>
                <line x1="20" y1="6" x2="20" y2="12" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 2"/>
                <line x1="20" y1="28" x2="20" y2="34" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 2"/>
                <line x1="6" y1="20" x2="12" y2="20" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 2"/>
                <line x1="28" y1="20" x2="34" y2="20" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 2"/>
              </svg>
            </div>
            <h3 class="card-title">3D Printing</h3>
            <p class="card-text">
              Additive manufacturing and rapid prototyping using FDM, SLA, and
              SLS technologies. From functional parts to production-ready
              prototypes.
            </p>
            <ul class="card-tags">
              <li>FDM / SLA / SLS</li>
              <li>Rapid Prototyping</li>
              <li>Functional Parts</li>
            </ul>
          </div>

          <div class="service-card">
            <div class="card-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="14" r="6" stroke="currentColor" stroke-width="2"/>
                <path d="M10 34v-4a6 6 0 016-6h8a6 6 0 016 6v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <rect x="16" y="24" width="8" height="4" rx="1" fill="currentColor" opacity="0.3"/>
                <circle cx="14" cy="8" r="2" fill="currentColor" opacity="0.5"/>
                <circle cx="26" cy="8" r="2" fill="currentColor" opacity="0.5"/>
                <path d="M8 26l4-3M32 26l-4-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <h3 class="card-title">Robotics</h3>
            <p class="card-text">
              Embedded control systems, automation, and custom robot design.
              Building intelligent machines that bridge software with the
              physical world.
            </p>
            <ul class="card-tags">
              <li>Automation</li>
              <li>Control Systems</li>
              <li>Custom Robot Design</li>
            </ul>
          </div>

          <div class="service-card">
            <div class="card-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="8" y="8" width="24" height="24" rx="3" stroke="currentColor" stroke-width="2"/>
                <rect x="12" y="12" width="16" height="12" rx="1" fill="currentColor" opacity="0.15"/>
                <path d="M26 24v6a2 2 0 002 2h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M14 24v6a2 2 0 01-2 2H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <rect x="17" y="14" width="6" height="1.5" rx="0.75" fill="currentColor" opacity="0.5"/>
                <rect x="17" y="17" width="6" height="1.5" rx="0.75" fill="currentColor" opacity="0.5"/>
                <rect x="17" y="20" width="4" height="1.5" rx="0.75" fill="currentColor" opacity="0.5"/>
                <circle cx="20" cy="30" r="1.5" fill="currentColor" opacity="0.5"/>
              </svg>
            </div>
            <h3 class="card-title">Embedded Systems</h3>
            <p class="card-text">
              Firmware development for ESP32, STM32, and ARM microcontrollers.
              IoT integration, real-time control, and low-power embedded
              solutions.
            </p>
            <ul class="card-tags">
              <li>ESP32 / STM32</li>
              <li>Firmware</li>
              <li>IoT & Real-Time</li>
            </ul>
          </div>

          <div class="service-card">
            <div class="card-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M4 30l12-18 8 10 6-6 6 10v4H4z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <circle cx="11" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                <line x1="24" y1="16" x2="28" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="28" y1="12" x2="32" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <rect x="8" y="30" width="24" height="2" rx="1" fill="currentColor" opacity="0.3"/>
              </svg>
            </div>
            <h3 class="card-title">Digital Engineering</h3>
            <p class="card-text">
              CAD/CAM modeling, simulation, and digital twin development.
              Bringing designs to life with precision engineering and virtual
              validation.
            </p>
            <ul class="card-tags">
              <li>CAD / CAM</li>
              <li>Simulation</li>
              <li>Digital Twins</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .services {
      padding: clamp(48px, 8vw, 120px) 0;
      background: var(--surface-alt);
    }

    .services-header {
      text-align: center;
      max-width: 640px;
      margin: 0 auto clamp(32px, 5vw, 64px);
    }

    .services-title {
      font-size: clamp(1.6rem, 4vw, 2.6rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--text);
    }

    .services-desc {
      margin-top: clamp(8px, 1.5vw, 16px);
      font-size: clamp(0.9rem, 1.5vw, 1.1rem);
      color: var(--text-secondary);
      line-height: 1.7;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: clamp(16px, 2vw, 24px);
    }

    .service-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: clamp(20px, 2.5vw, 32px);
      transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
    }

    .service-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
      border-color: var(--accent);
    }

    .card-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: var(--radius-sm);
      background: var(--surface-alt);
      color: var(--accent);
      margin-bottom: clamp(12px, 1.5vw, 20px);
    }

    .card-title {
      font-size: clamp(1rem, 1.8vw, 1.25rem);
      font-weight: 700;
      color: var(--text);
      margin-bottom: clamp(6px, 1vw, 10px);
    }

    .card-text {
      font-size: clamp(0.8rem, 1.2vw, 0.9rem);
      color: var(--text-secondary);
      line-height: 1.7;
      margin-bottom: clamp(12px, 1.5vw, 20px);
    }

    .card-tags {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .card-tags li {
      font-size: clamp(0.7rem, 1vw, 0.78rem);
      font-weight: 500;
      color: var(--accent);
      background: rgba(59, 130, 246, 0.08);
      padding: 4px 10px;
      border-radius: 20px;
      line-height: 1.4;
    }

    @media (max-width: 1024px) {
      .services-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 600px) {
      .services-grid {
        grid-template-columns: 1fr;
      }

      .service-card {
        padding: 24px;
      }
    }

    @media (min-width: 1600px) {
      .services {
        padding: 140px 0;
      }

      .services-grid {
        gap: 28px;
      }

      .service-card {
        padding: 36px;
      }
    }
  `]
})
export class ServicesSectionComponent {}
