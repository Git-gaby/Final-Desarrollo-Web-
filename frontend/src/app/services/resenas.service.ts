import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Resena {
  id?: number;
  nombre_restaurante: string;
  calificacion: number;
  fecha_visita: string;
  observaciones: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResenasService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/resenas';

  obtenerResenas(): Observable<Resena[]> {
    return this.http.get<Resena[]>(this.apiUrl);
  }

  crearResena(resena: Resena): Observable<any> {
    return this.http.post(this.apiUrl, resena);
  }

  actualizarResena(id: number, resena: Resena): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, resena);
  }

  eliminarResena(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}