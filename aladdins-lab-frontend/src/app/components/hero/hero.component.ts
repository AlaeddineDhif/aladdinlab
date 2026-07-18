import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  isDark = signal(document.body.classList.contains('dark-theme'));

  toggleTheme(): void {
    this.isDark.update(v => !v);
    document.body.classList.toggle('dark-theme');
  }
}
