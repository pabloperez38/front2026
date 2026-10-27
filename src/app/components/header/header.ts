import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  cerrarSesion(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.finalizarSesion();
      },
      error: () => {
        // También cerramos la sesión local si falla la petición.
        this.finalizarSesion();
      },
    });
  }

  private finalizarSesion(): void {
    this.authService.limpiarSesion();
    this.router.navigate(['/login']);
  }
}
