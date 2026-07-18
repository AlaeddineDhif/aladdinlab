import { Component } from '@angular/core';
import { WorkWithMeFormComponent } from '../../components/work-with-me/work-with-me-form.component';

@Component({
  selector: 'app-work-with-me-page',
  standalone: true,
  imports: [WorkWithMeFormComponent],
  template: `
    <div class="page">
      <div class="container page-header">
        <h1>Work With Me</h1>
        <p>Looking for sponsorship, a collaboration partner, or a custom engineering project? Let's talk.</p>
      </div>
      <app-work-with-me-form />
    </div>
  `,
  styles: [`
    .page {
      padding: clamp(24px, 4vw, 56px) 0;
    }

    .page-header {
      text-align: center;
      max-width: min(640px, 90vw);
      margin: 0 auto;
    }

    .page-header h1 {
      font-size: clamp(1.5rem, 3vw, 2.5rem);
      font-weight: 700;
      margin-bottom: clamp(6px, 1vw, 12px);
    }

    .page-header p {
      color: var(--text-secondary);
      font-size: clamp(0.9rem, 1.4vw, 1.1rem);
    }

    @media (max-width: 480px) {
      .page {
        padding: 16px 0;
      }
    }

    @media (min-width: 1600px) {
      .page-header {
        max-width: 800px;
      }
    }
  `]
})
export class WorkWithMePageComponent {}