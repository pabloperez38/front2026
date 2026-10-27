import { Routes } from '@angular/router';

import { Inicio } from './pages/inicio/inicio';
import { Categorias } from './pages/categorias/categorias';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'inicio',
    component: Inicio,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'categorias',
    component: Categorias,
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'inicio',
  },
];
