import { Component, signal } from '@angular/core';

interface DealItem {
  badge?: string;
  icon: string;
  title: string;
  category: string;
  description: string;
  code: string;
  offer: string;
  shopUrl: string;
}

@Component({
  selector: 'app-deals-section',
  standalone: true,
  template: `
    <section id="deals" class="deals-section">
      <div id="robot-target-deals" class="robot-anchor right-anchor"></div>
      <div class="container">
        <div class="section-header text-center">
          <div class="badge-pill mini">
            <i class="fa-solid fa-tags"></i> Community Benefits
          </div>
          <h2 class="section-title">Community Deals &amp; Recommended Gear</h2>
          <p class="section-description">
            Tested &amp; approved 3D printers, microcontrollers, components, and tools with exclusive discount codes.
          </p>
        </div>

        <div class="deals-grid">
          @for (deal of deals; track deal.title) {
            <article class="deal-card">
              @if (deal.badge) {
                <span class="deal-badge">{{ deal.badge }}</span>
              }
              <div class="deal-header">
                <div class="deal-icon"><i class="fa-solid {{ deal.icon }}"></i></div>
                <div>
                  <h3 class="deal-title">{{ deal.title }}</h3>
                  <span class="deal-category">{{ deal.category }}</span>
                </div>
              </div>
              <p class="deal-description">{{ deal.description }}</p>
              <div class="deal-footer">
                <div class="promo-box">
                  <span class="promo-code">{{ deal.code }}</span>
                  <button class="copy-promo-btn" (click)="copyPromoCode(deal.code, $event)">
                    <i class="fa-solid {{ copiedCode() === deal.code ? 'fa-check' : 'fa-copy' }}"></i>
                    {{ copiedCode() === deal.code ? 'Copied!' : deal.offer }}
                  </button>
                </div>
                <a [href]="deal.shopUrl" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
                  View Deal <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .deals-section {
      position: relative;
      padding: 90px 0;
      background-color: #ffffff;
    }

    .section-header {
      max-width: 680px;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 50px;
    }

    .text-center { text-align: center; }

    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 9999px;
      background-color: #fffbeb;
      border: 1px solid rgba(217, 119, 6, 0.25);
      color: #d97706;
      font-size: 0.825rem;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .section-title {
      font-size: clamp(2rem, 3.2vw, 2.75rem);
      margin-bottom: 12px;
      color: #0f172a;
      letter-spacing: -0.03em;
      font-weight: 800;
    }

    .section-description {
      font-size: 1.1rem;
      color: #475569;
    }

    .deals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
      gap: 24px;
    }

    .deal-card {
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 24px;
      position: relative;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      transition: transform var(--transition), border-color var(--transition);
      display: flex;
      flex-direction: column;
    }

    .deal-card:hover {
      transform: translateY(-3px);
      border-color: #cbd5e1;
      box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.06);
    }

    .deal-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      background-color: #10b981;
      color: #ffffff;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 9999px;
      text-transform: uppercase;
    }

    .deal-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 14px;
    }

    .deal-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background-color: #eff6ff;
      color: #2563eb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .deal-title {
      font-size: 1.05rem;
      font-weight: 700;
      line-height: 1.25;
      color: #0f172a;
    }

    .deal-category {
      font-size: 0.75rem;
      color: #64748b;
    }

    .deal-description {
      font-size: 0.875rem;
      color: #475569;
      margin-bottom: 20px;
      flex: 1;
      line-height: 1.5;
    }

    .deal-footer {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .promo-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #f8fafc;
      border: 1px dashed #e2e8f0;
      padding: 8px 12px;
      border-radius: 6px;
    }

    .promo-code {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-weight: 700;
      font-size: 0.9rem;
      color: #2563eb;
      letter-spacing: 0.05em;
    }

    .copy-promo-btn {
      background: none;
      border: none;
      color: #64748b;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 6px;
      transition: background-color var(--transition), color var(--transition);
      font-family: inherit;
    }

    .copy-promo-btn:hover {
      background-color: #f1f5f9;
      color: #0f172a;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 24px;
      font-size: 0.95rem;
      font-weight: 600;
      border-radius: 12px;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all var(--transition);
      text-decoration: none;
      white-space: nowrap;
    }

    .btn-outline {
      background: transparent;
      color: #2563eb;
      border-color: #e2e8f0;
    }

    .btn-outline:hover {
      background: #eff6ff;
      border-color: #2563eb;
    }

    .btn-sm {
      padding: 8px 16px;
      font-size: 0.875rem;
    }

    @media (max-width: 600px) {
      .deals-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DealsSectionComponent {
  copiedCode = signal('');

  deals: DealItem[] = [
    {
      badge: 'Popular',
      icon: 'fa-cube',
      title: 'Bambu Lab CoreXY 3D Printer',
      category: '3D Printing',
      description: 'High-speed multi-color 3D printing setup used in Aladdin\'s Lab for prototyping robot chassis and enclosures.',
      code: 'ALADDIN10',
      offer: 'Copy (10% OFF)',
      shopUrl: 'https://www.youtube.com/@AladdinLab_25'
    },
    {
      icon: 'fa-microchip',
      title: 'ESP32 & Wireless IoT Kit',
      category: 'Embedded Electronics',
      description: 'Complete microcontroller kit with Wi-Fi/Bluetooth, OLED displays, and sensors for custom IoT projects.',
      code: 'ALADDINLAB5',
      offer: 'Copy ($5 OFF)',
      shopUrl: 'https://www.youtube.com/@AladdinLab_25'
    },
    {
      icon: 'fa-bolt',
      title: 'Smart Soldering Station',
      category: 'Lab Hardware',
      description: 'PID temperature-controlled soldering iron kit for PCB assembly, custom wiring, and SMD repairs.',
      code: 'ALADDIN15',
      offer: 'Copy (15% OFF)',
      shopUrl: 'https://www.youtube.com/@AladdinLab_25'
    },
    {
      icon: 'fa-layer-group',
      title: 'Engineering PLA+ Filament',
      category: 'Materials',
      description: 'Impact-resistant PLA+ filament ideal for structural drone parts, gearboxes, and functional brackets.',
      code: 'LABGEAR10',
      offer: 'Copy (10% OFF)',
      shopUrl: 'https://www.youtube.com/@AladdinLab_25'
    }
  ];

  async copyPromoCode(code: string, event: Event): Promise<void> {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const el = document.createElement('textarea');
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    this.copiedCode.set(code);
    setTimeout(() => this.copiedCode.set(''), 2000);
    (event.target as HTMLElement).closest('.copy-promo-btn')?.classList.add('copied');
  }
}
