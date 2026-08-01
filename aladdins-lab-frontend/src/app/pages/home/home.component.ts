import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { VideosSectionComponent } from '../../components/videos-section/videos-section.component';
import { DealsSectionComponent } from '../../components/deals-section/deals-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, VideosSectionComponent, DealsSectionComponent],
  template: `
    <app-hero />
    <app-videos-section />
    <app-deals-section />
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class HomeComponent {}
