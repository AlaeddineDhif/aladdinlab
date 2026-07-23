import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { SupabaseService } from './services/supabase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ProfileEditComponent],
  template: `
    <app-navbar></app-navbar>
    <main>
      <router-outlet />
    </main>
    <app-footer />
    @if (supabase.showEditProfile()) {
      <app-profile-edit (close)="supabase.showEditProfile.set(false)" />
    }
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
export class AppComponent {
  protected supabase = inject(SupabaseService);
}