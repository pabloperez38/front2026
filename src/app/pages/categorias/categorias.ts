import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CategoriasService, Categoria, NuevaCategoria } from '../../services/categorias';

@Component({
  selector: 'app-categorias',
  imports: [FormsModule],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit {
  modalAbierto = signal(false);
  estadoCategoria = 1;

  abrirModal(): void {
    this.categoriaEditando.set(null);
    this.nombre = '';
    this.descripcion = '';
    this.error.set('');
    this.mensaje.set('');
    this.modalAbierto.set(true);
  }

  editarCategoria(categoria: Categoria): void {
    this.categoriaEditando.set(categoria.id);
    this.nombre = categoria.nombre;
    this.descripcion = categoria.descripcion ?? '';
    this.estadoCategoria = categoria.estado;
    this.error.set('');
    this.mensaje.set('');
    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    if (this.guardando()) {
      return;
    }

    this.modalAbierto.set(false);
    this.categoriaEditando.set(null);
  }

  private categoriasService = inject(CategoriasService);

  categorias = signal<Categoria[]>([]);
  cargando = signal(true);
  error = signal('');

  nombre = '';
  descripcion = '';
  activo = true;

  guardando = signal(false);
  mensaje = signal('');

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.cargando.set(true);
    this.error.set('');

    this.categoriasService.obtenerCategorias().subscribe({
      next: (respuesta) => {
        this.categorias.set(respuesta.categorias);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al obtener categorías:', err);
        this.error.set('No se pudieron cargar las categorías.');
        this.cargando.set(false);
      },
    });
  }

  guardarCategoria(): void {
    this.mensaje.set('');
    this.error.set('');

    const datos: NuevaCategoria = {
      nombre: this.nombre.trim(),
      descripcion: this.descripcion.trim(),
      ...(this.categoriaEditando() !== null ? { estado: this.estadoCategoria } : {}),
    };

    if (datos.nombre.length < 2) {
      this.error.set('El nombre debe tener al menos 2 caracteres.');
      return;
    }

    this.guardando.set(true);

    const id = this.categoriaEditando();

    const solicitud =
      id === null
        ? this.categoriasService.crearCategoria(datos)
        : this.categoriasService.actualizarCategoria(id, datos);

    this.guardando.set(true);

    solicitud.subscribe({
      next: (respuesta) => {
        this.mensaje.set(respuesta.message);

        this.nombre = '';
        this.descripcion = '';
        this.guardando.set(false);
        this.modalAbierto.set(false);
        this.categoriaEditando.set(null);

        this.cargarCategorias();
      },
      error: (err) => {
        console.error('Error al guardar categoría:', err);

        if (err.status === 422) {
          this.error.set(
            err.error?.errors?.nombre?.[0] ??
              err.error?.errors?.descripcion?.[0] ??
              err.error?.message ??
              'Revisá los datos ingresados.',
          );
        } else {
          this.error.set('No se pudo guardar la categoría. Verificá la conexión con Laravel.');
        }

        this.guardando.set(false);
      },
    });
  }

  categoriaEditando = signal<number | null>(null);
}
