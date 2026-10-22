
import { Routes } from '@angular/router';

import { Inicio } from './pages/inicio/inicio';
import { Categorias } from './pages/categorias/categorias';

export const routes: Routes = [
  {
    path: 'inicio',
    component: Inicio
  },
  {
    path: 'categorias',
    component: Categorias
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'inicio'
  }
];
