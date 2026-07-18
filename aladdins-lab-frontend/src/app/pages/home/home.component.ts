import { Component } from '@angular/core';
import { ServicesSectionComponent } from '../../components/services-section/services-section.component';
import { HeroComponent } from '../../components/hero/hero.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, ServicesSectionComponent],
  template: `
    <app-hero />
    <app-services-section />
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class HomeComponent {}
