import { Component, signal, inject } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  private supabase = inject(SupabaseService);

  isDark = signal(document.body.classList.contains('dark-theme'));
  authLoading = signal(false);

  toggleTheme(): void {
    this.isDark.update(v => !v);
    document.body.classList.toggle('dark-theme');
  }

  async loginWithGoogle(): Promise<void> {
    this.authLoading.set(true);
    await this.supabase.signInWithGoogle();
    this.authLoading.set(false);
  }
}
