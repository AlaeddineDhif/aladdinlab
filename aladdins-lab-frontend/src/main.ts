import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, Routes, withComponentInputBinding } from '@angular/router';
import { AppComponent } from './app/app.component';

const routes: Routes = [
  { path: '', loadComponent: () => import('./app/pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'work-with-me', loadComponent: () => import('./app/pages/work-with-me-page/work-with-me-page.component').then(m => m.WorkWithMePageComponent) },
  { path: '3d-printing', loadComponent: () => import('./app/pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'esp32-projects', loadComponent: () => import('./app/pages/home/home.component').then(m => m.HomeComponent) },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch())
  ]
});