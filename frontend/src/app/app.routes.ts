import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/public/public-home.component').then((m) => m.PublicHomeComponent)
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./features/admin/components/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'login-success',
    loadComponent: () =>
      import('./features/admin/components/oauth2-redirect/oauth2-redirect.component').then(
        (m) => m.Oauth2RedirectComponent
      )
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      )
  },
  { path: '**', redirectTo: '' }
];
