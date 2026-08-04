import { Component, signal, computed } from '@angular/core';

type CategoryKey = 'all' | 'ai' | 'printers' | 'iot' | 'materials';

interface CategoryTab {
  key: CategoryKey;
  label: string;
}

interface ResourceItem {
  title: string;
  category: CategoryKey;
  categoryLabel: string;
  description: string;
  badge?: string;
  promoCode?: string;
  promoOffer?: string;
  logo: string;
  linkUrl: string;
  linkLabel: string;
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
            <i class="fa-solid fa-tags"></i> Resource Directory
          </div>
          <h2 class="section-title">Recommended Gear &amp; AI Tools</h2>
          <p class="section-description">
            A curated, categorized hub of 3D printing hardware, IoT components, and AI 3D tools —
            tested by Aladdin's Lab.
          </p>
        </div>

        <div class="tabs" role="tablist" aria-label="Resource categories">
          @for (tab of tabs; track tab.key) {
            <button
              class="tab"
              [class.active]="activeTab() === tab.key"
              (click)="setTab(tab.key)"
              role="tab"
            >
              {{ tab.label }}
            </button>
          }
        </div>

        <div class="resources-grid">
          @for (item of filteredResources(); track item.title) {
<article class="resource-card">
               @if (item.badge) {
                 <span class="resource-badge">{{ item.badge }}</span>
               }

               <div class="card-header">
                 <div class="icon-chip">
                   <img [src]="item.logo" class="w-12 h-12 object-contain rounded-lg shadow-sm bg-white p-1" alt="logo" />
                 </div>
                 <div class="card-titles">
                   <h3 class="resource-title">{{ item.title }}</h3>
                   <span class="category-tag">{{ item.categoryLabel }}</span>
                 </div>
               </div>

               <p class="resource-description">{{ item.description }}</p>

               @if (item.promoCode) {
                 <div class="promo-box">
                   <div class="promo-info">
                     <span class="promo-label">Discount Code</span>
                     <span class="promo-code">{{ item.promoCode }}</span>
                   </div>
                   <button class="copy-promo-btn" (click)="copyPromoCode(item.promoCode!, 'copy-' + item.title)">
                     @if (copiedKey() === 'copy-' + item.title) {
                       <i class="fa-solid fa-check"></i>
                     } @else {
                       <i class="fa-solid fa-copy"></i>
                     }
                     {{ copiedKey() === ('copy-' + item.title) ? 'Copied!' : (item.promoOffer || 'Copy Code') }}
                   </button>
                 </div>
               }

               <div class="card-footer mt-auto">
                 <a [href]="item.linkUrl" target="_blank" rel="noopener noreferrer" class="btn-access">
                   {{ item.linkLabel }} <i class="fa-solid fa-arrow-up-right-from-square"></i>
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
      max-width: 720px;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 44px;
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
      line-height: 1.6;
    }

    .tabs {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin-bottom: 40px;
    }

    .tab {
      padding: 10px 20px;
      border-radius: 9999px;
      border: 1px solid #e2e8f0;
      background-color: #ffffff;
      color: #475569;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition);
      font-family: inherit;
    }

    .tab:hover {
      border-color: #cbd5e1;
      color: #0f172a;
    }

    .tab.active {
      background-color: #0f172a;
      color: #ffffff;
      border-color: #0f172a;
      box-shadow: 0 4px 14px rgba(15, 23, 42, 0.18);
    }

    .resources-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .resource-card {
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 24px;
      position: relative;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      transition: transform var(--transition), border-color var(--transition), box-shadow var(--transition);
      display: flex;
      flex-direction: column;
    }

    .resource-card:hover {
      transform: translateY(-4px);
      border-color: #2943dc;
      box-shadow: 0 12px 24px -8px rgba(37, 99, 235, 0.18);
    }

    .resource-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      background-color: #10b981;
      color: #ffffff;
      font-size: 0.68rem;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 14px;
    }

    .icon-chip {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background-color: #eff6ff;
      color: #2563eb;
    }

    .card-titles {
      display: flex;
      flex-direction: column;
    }

    .resource-title {
      font-size: 1.05rem;
      font-weight: 700;
      line-height: 1.25;
      color: #0f172a;
    }

    .category-tag {
      display: inline-flex;
      align-self: flex-start;
      margin-top: 6px;
      font-size: 0.72rem;
      font-weight: 600;
      color: #475569;
      background-color: #f1f5f9;
      border: 1px solid #e2e8f0;
      padding: 2px 8px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .resource-description {
      font-size: 0.875rem;
      color: #475569;
      line-height: 1.55;
      margin-bottom: 18px;
      flex: 1;
    }

    .card-footer {
      margin-bottom: 12px;
      margin-top: auto;
    }

    .btn-access {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 11px 16px;
      font-size: 0.875rem;
      font-weight: 600;
      border-radius: 10px;
      background-color: var(--accent);
      color: #ffffff;
      text-decoration: none;
      transition: all var(--transition);
      box-shadow: 0 4px 14px rgba(59, 130, 246, 0.12);
    }

    .btn-access:hover {
      background-color: var(--accent-hover);
      box-shadow: 0 6px 16px rgba(37, 99, 235, 0.22);
    }

    .promo-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      background-color: #f8fafc;
      border: 1px dashed #c7d2fe;
      padding: 10px 12px;
      border-radius: 10px;
      width: 100%;
    }

    .promo-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      flex: 1;
    }

    .promo-label {
      font-size: 0.62rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #64748b;
    }

    .promo-code {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-weight: 700;
      font-size: 0.85rem;
      color: #2563eb;
      letter-spacing: 0.05em;
      white-space: nowrap;
      overflow: visible;
      text-overflow: clip;
    }

    .copy-promo-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 8px;
      border: none;
      background: none;
      color: #475569;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all var(--transition);
      font-family: inherit;
      flex-shrink: 0;
    }

    .copy-promo-btn:hover {
      background-color: #eef2ff;
      color: #4338ca;
    }

    .copy-promo-btn.copied {
      color: #059669;
      background-color: #ecfdf5;
    }

    @media (max-width: 600px) {
      .resources-grid { grid-template-columns: 1fr; }
      .tabs { gap: 8px; }
      .tab { padding: 8px 14px; font-size: 0.8rem; }
    }
  `]
})
export class DealsSectionComponent {
  copiedKey = signal('');

  tabs: CategoryTab[] = [
    { key: 'all', label: 'All' },
    { key: 'ai', label: 'AI 3D Tools' },
    { key: 'printers', label: '3D Printers & Parts' },
    { key: 'iot', label: 'IoT & Hardware' },
    { key: 'materials', label: 'Filaments & Materials' }
  ];

  activeTab = signal<CategoryKey>('all');

  resources: ResourceItem[] = [
    {
      title: 'Obloid',
      category: 'ai',
      categoryLabel: 'AI 3D Generator',
      badge: 'Popular',
      logo: 'assets/obloid incon.png',
      description: 'Fast AI text-to-3D generation for concept models, robot parts, and print-ready assets created with Aladdin\'s Lab.',
      promoCode: 'ALADDINLAB15',
      promoOffer: 'Copy (15% OFF)',
      linkUrl: 'https://obloid.app/',
      linkLabel: 'Access Tool'
    },
    {
      title: 'Meshy AI',
      category: 'ai',
      categoryLabel: 'AI 3D Tool',
      description: 'Turn text or images into detailed 3D meshes in seconds — ideal for rapid prototyping and animation-ready characters.',
      logo: 'assets/meshy logo.png',
      linkUrl: 'https://www.meshy.ai?via=AladdinsLab',
      linkLabel: 'Access Tool'
    },
    {
      title: 'Bambu Lab Spare Parts & Nozzles',
      category: 'printers',
      categoryLabel: '3D Printer Hardware',
      description: 'Official replacement parts, hardened nozzles, and toolheads that keep your CoreXY printer running at full precision.',
      badge: 'Best Pick',
      logo: 'assets/Nozzle.jpg',
      linkUrl: 'https://amzn.to/4zfxBuT',
      linkLabel: 'View Gear'
    },
    {
      title: 'Bambu Lab Build Plates & Accessories',
      category: 'printers',
      categoryLabel: '3D Printers & Parts',
      description: 'Upgrade kit components for frame rigidity, vibration damping, and multi-color printing reliability.',
      logo: 'assets/plate.png',
      linkUrl: 'https://amzn.to/4fHi2CU',
      linkLabel: 'View Gear'
    },
    {
      title: 'ESP32 & ESP-CAM Dev Kits',
      category: 'iot',
      categoryLabel: 'IoT & Hardware',
      description: 'Wi-Fi/Bluetooth-enabled microcontroller dev boards for custom IoT automation, sensor hubs, and robotics control.',
      logo: 'assets/espcam.jpg',
      linkUrl: 'https://amzn.to/4fE7plP',
      linkLabel: 'View Gear'
    },
    {
      title: 'Raspberry Pi Board & Kits',
      category: 'iot',
      categoryLabel: 'IoT & Hardware',
      description: 'Full Linux single-board computer for running camera pipelines, web servers, and autonomous lab scripts.',
      logo: 'assets/raspberry-pi.png',
      linkUrl: 'https://amzn.to/3TCwa9k',
      linkLabel: 'View Gear'
    },
    {
      title: '10 SUNLU PLA Plus',
      category: 'materials',
      categoryLabel: 'Filaments & Materials',
      description: 'Impact-resistant PLA+ ideal for structural parts, gearboxes, and functional brackets under load.',
      logo: 'assets/filamante.png',
      linkUrl: 'https://amzn.to/4pYQLRt',
      linkLabel: 'View Gear'
    },
    {
      title: '4KG SUNLU PLA Plus',
      category: 'materials',
      categoryLabel: 'Filaments & Materials',
      description: 'Precision-wound, dry-sealed spools engineered for reliable multi-color printing across projects.',
      logo: 'assets/filamante.png',
      linkUrl: 'https://amzn.to/4xhdSJb',
      linkLabel: 'View Gear'
    }
  ];

  filteredResources = computed(() => {
    const tab = this.activeTab();
    if (tab === 'all') {
      return this.resources;
    }
    return this.resources.filter(r => r.category === tab);
  });

  setTab(key: CategoryKey): void {
    this.activeTab.set(key);
  }

  async copyPromoCode(code: string, key: string): Promise<void> {
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
    this.copiedKey.set(key);
    setTimeout(() => this.copiedKey.set(''), 2000);
  }
}