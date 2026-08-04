import { Component, signal } from '@angular/core';

interface VideoItem {
  id: string;
  url: string;
  embedUrl: string;
  title: string;
  tag: string;
  desc: string;
  thumbnail: string;
  isNew?: boolean;
}

@Component({
  selector: 'app-videos-section',
  standalone: true,
  template: `
    <section id="videos" class="videos-section">
      <div id="robot-target-videos" class="robot-anchor left-anchor"></div>
      <div class="container">
        <div class="section-header text-center">
          <div class="badge-pill mini">
            <i class="fa-brands fa-youtube"></i> Video Library
          </div>
          <h2 class="section-title">Featured Tutorials &amp; Deep Dives</h2>
          <p class="section-description">
            Step-by-step engineering walkthroughs, 3D printing projects, and custom robotics builds.
          </p>
        </div>

        <div class="videos-grid">
          @for (video of videos; track video.id) {
            <article class="video-card">
              <div class="video-thumb-container" (click)="openVideo(video)">
                <img [src]="video.thumbnail" [alt]="video.title" class="video-thumb-img" loading="lazy" />
                <div class="play-badge">
                  <div class="play-circle">
                    <i class="fa-solid fa-play"></i>
                  </div>
                </div>
                @if (video.isNew) {
                  <span class="new-badge">NEW</span>
                }
              </div>

              <div class="video-body">
                <span class="video-tag"><i class="fa-solid fa-layer-group"></i> {{ video.tag }}</span>
                <h3 class="video-card-title">{{ video.title }}</h3>
                <p class="video-card-desc">{{ video.desc }}</p>

                <div class="video-card-action">
                  <a [href]="video.url" target="_blank" rel="noopener noreferrer" class="watch-link">
                    Watch on YouTube <i class="fa-solid fa-arrow-up-right-from-square"></i>
                  </a>
                </div>
              </div>
            </article>
          }
        </div>

        <div class="text-center margin-top-lg">
          <a href="https://www.youtube.com/@AladdinLab_25" target="_blank" rel="noopener" class="btn btn-primary btn-lg">
            <i class="fa-brands fa-youtube"></i> Visit YouTube Channel
          </a>
        </div>
      </div>

      <!-- Video Player Modal -->
      @if (activeVideo()) {
        <div class="modal-backdrop" (click)="closeVideo()">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <button class="close-btn" (click)="closeVideo()" aria-label="Close video">
              <i class="fa-solid fa-xmark"></i>
            </button>
            <div class="modal-video-container">
              <iframe [src]="activeVideo()!.embedUrl" title="YouTube Video Player" allowfullscreen></iframe>
            </div>
            <div class="modal-info">
              <h3>{{ activeVideo()!.title }}</h3>
              <p>{{ activeVideo()!.desc }}</p>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    .videos-section {
      position: relative;
      padding: 90px 0;
      background-color: #f8fafc;
      border-top: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
    }

    .section-header {
      max-width: 680px;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 50px;
    }

    .text-center { text-align: center; }
    .margin-top-lg { margin-top: 40px; }

    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 9999px;
      background-color: #eff6ff;
      border: 1px solid rgba(37, 99, 235, 0.2);
      color: #2563eb;
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

    .videos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 28px;
    }

    .video-card {
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
      display: flex;
      flex-direction: column;
    }

    .video-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.08);
      border-color: #2563eb;
    }

    .video-thumb-container {
      position: relative;
      aspect-ratio: 16 / 9;
      overflow: hidden;
      cursor: pointer;
      background-color: #f1f5f9;
    }

    .video-thumb-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition);
    }

    .video-card:hover .video-thumb-img {
      transform: scale(1.05);
    }

    .play-badge {
      position: absolute;
      inset: 0;
      background-color: rgba(15, 23, 42, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity var(--transition);
    }

    .video-card:hover .play-badge { opacity: 1; }

    .play-circle {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background-color: #ff0000;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      box-shadow: 0 4px 20px rgba(255, 0, 0, 0.5);
    }

    .new-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background-color: #2563eb;
      color: #ffffff;
      font-size: 0.65rem;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 9999px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      box-shadow: 0 0 12px rgba(37, 99, 235, 0.5), 0 2px 8px rgba(37, 99, 235, 0.3);
      animation: pulse-new 2s ease-in-out infinite;
    }

    @keyframes pulse-new {
      0%, 100% { box-shadow: 0 0 12px rgba(37, 99, 235, 0.5), 0 2px 8px rgba(37, 99, 235, 0.3); }
      50% { box-shadow: 0 0 20px rgba(37, 99, 235, 0.7), 0 2px 12px rgba(37, 99, 235, 0.4); }
    }

    .video-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .video-tag {
      font-size: 0.75rem;
      font-weight: 700;
      color: #2563eb;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }

    .video-card-title {
      font-size: 1.1rem;
      font-weight: 700;
      line-height: 1.35;
      margin-bottom: 10px;
      color: #0f172a;
    }

    .video-card-desc {
      font-size: 0.875rem;
      color: #475569;
      line-height: 1.5;
      margin-bottom: 18px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .video-card-action {
      margin-top: auto;
      padding-top: 14px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .watch-link {
      font-size: 0.875rem;
      font-weight: 600;
      color: #2563eb;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 16px 32px;
      font-size: 1.05rem;
      font-weight: 600;
      border-radius: 20px;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all var(--transition);
      text-decoration: none;
      white-space: nowrap;
    }

    .btn-primary {
      background-color: #2563eb;
      color: #ffffff !important;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.12);
    }

    .btn-primary:hover {
      background-color: #1d4ed8;
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.2);
    }

    /* Video Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background-color: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(8px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .modal-card {
      max-width: 860px;
      width: 100%;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 20px;
      position: relative;
      box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.08);
    }

    .close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      color: #0f172a;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }

    .modal-video-container {
      aspect-ratio: 16 / 9;
      width: 100%;
      border-radius: 12px;
      overflow: hidden;
      background-color: #f1f5f9;
      margin-bottom: 16px;
    }

    .modal-video-container iframe {
      width: 100%;
      height: 100%;
      border: none;
    }

    .modal-info h3 {
      font-size: 1.25rem;
      margin-bottom: 6px;
      color: #0f172a;
    }

    .modal-info p {
      font-size: 0.9rem;
      color: #475569;
    }

    @media (max-width: 600px) {
      .videos-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class VideosSectionComponent {
  activeVideo = signal<VideoItem | null>(null);

  videos: VideoItem[] = [
    {
      id: 'yJ35H3fqcc0',
      url: 'https://youtu.be/yJ35H3fqcc0',
      embedUrl: 'https://www.youtube-nocookie.com/embed/yJ35H3fqcc0?autoplay=1',
      title: 'Latest Build: Custom 3D Printer Frame & Electronics Setup',
      tag: 'New',
      desc: 'A full walkthrough of our latest 3D printer frame build with custom electronics and automation.',
      thumbnail: 'https://img.youtube.com/vi/yJ35H3fqcc0/maxresdefault.jpg',
      isNew: true
    },
    {
      id: 'qYAben1VhDo',
      url: 'https://youtu.be/qYAben1VhDo',
      embedUrl: 'https://www.youtube-nocookie.com/embed/qYAben1VhDo?autoplay=1',
      title: 'Bambu Studio Thread Advanced Setting (End-to-End)',
      tag: '3D Printing',
      desc: 'A complete step-by-step walkthrough of advanced thread settings in Bambu Studio for clean, functional threads.',
      thumbnail: 'https://img.youtube.com/vi/qYAben1VhDo/maxresdefault.jpg'
    },
    {
      id: '5o-SPUenYO8',
      url: 'https://youtu.be/5o-SPUenYO8',
      embedUrl: 'https://www.youtube-nocookie.com/embed/5o-SPUenYO8?autoplay=1',
      title: 'How to Convert PNG to 3D Printer (Multicolor)',
      tag: 'Embedded Systems / IoT',
      desc: 'Turn any PNG into a multicolor 3D print with this complete conversion workflow guide.',
      thumbnail: 'https://img.youtube.com/vi/5o-SPUenYO8/maxresdefault.jpg'
    },
    {
      id: 'Gf9lYkPjmTk',
      url: 'https://youtu.be/Gf9lYkPjmTk',
      embedUrl: 'https://www.youtube-nocookie.com/embed/Gf9lYkPjmTk?autoplay=1',
      title: 'How to Make Thread in Bambu Lab',
      tag: '3D Printing Hardware',
      desc: 'Designing and printing screw threads on Bambu Lab printers — sizing, tolerances, and best practices.',
      thumbnail: 'https://img.youtube.com/vi/Gf9lYkPjmTk/maxresdefault.jpg'
    },
    {
      id: 'ZutmP8pFcjw',
      url: 'https://youtu.be/ZutmP8pFcjw',
      embedUrl: 'https://www.youtube-nocookie.com/embed/ZutmP8pFcjw?autoplay=1',
      title: 'How to Reduce Filament Change Times in Bambu Studio',
      tag: 'Robotics & Vision',
      desc: 'Speed up multicolor prints by optimizing filament change purge settings in Bambu Studio.',
      thumbnail: 'https://img.youtube.com/vi/ZutmP8pFcjw/maxresdefault.jpg'
    },
    {
      id: '4cYF-Z06HBI',
      url: 'https://youtu.be/4cYF-Z06HBI',
      embedUrl: 'https://www.youtube-nocookie.com/embed/4cYF-Z06HBI?autoplay=1',
      title: 'How to Make Threads in Bambu Studio',
      tag: 'Lab Essentials & Hardware',
      desc: 'Everything you need to add strong, printable threads to your parts directly inside Bambu Studio.',
      thumbnail: 'https://img.youtube.com/vi/4cYF-Z06HBI/maxresdefault.jpg'
    }
  ];

  openVideo(video: VideoItem): void {
    this.activeVideo.set(video);
  }

  closeVideo(): void {
    this.activeVideo.set(null);
  }
}
