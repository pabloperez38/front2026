import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  estado: number;
}

export interface NuevaCategoria {
  nombre: string;
  descripcion: string;
  estado?: number;
}

interface RespuestaCategorias {
  message: string;
  categorias: Categoria[];
}

interface RespuestaCategoria {
  message: string;
  categoria: Categoria;
}

@Injectable({
  providedIn: 'root',
})
export class CategoriasService {
  private http = inject(HttpClient);

  private apiUrl = 'http://127.0.0.1:8000/api/categorias';

  obtenerCategorias(): Observable<RespuestaCategorias> {
    return this.http.get<RespuestaCategorias>(this.apiUrl);
  }

  crearCategoria(datos: NuevaCategoria): Observable<RespuestaCategoria> {
    return this.http.post<RespuestaCategoria>(this.apiUrl, datos);
  }

  actualizarCategoria(id: number, datos: NuevaCategoria): Observable<RespuestaCategoria> {
    return this.http.put<RespuestaCategoria>(`${this.apiUrl}/${id}`, datos);
  }
}
