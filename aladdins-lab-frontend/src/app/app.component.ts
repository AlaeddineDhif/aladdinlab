import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <main>
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: [`
    main {
      min-height: calc(100vh - 160px);
    }

    @media (max-width: 480px) {
      main {
        min-height: calc(100vh - 140px);
      }
    }
  `]
})
export class AppComponent {}