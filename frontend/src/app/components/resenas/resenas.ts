import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResenasService, Resena } from '../../services/resenas.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-resenas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './resenas.html', // Cambia a './resenas.component.html' si tu CLI usa .component
  styleUrl: './resenas.css'      // Cambia a './resenas.component.css' si tu CLI usa .component
})
export class ResenasComponent implements OnInit {
  private fb = inject(FormBuilder);
  private resenasService = inject(ResenasService);
  private authService = inject(AuthService);

  usuario = this.authService.getUsuario();
  resenas: Resena[] = [];
  editandoId: number | null = null;
  mensaje = '';
  error = '';

  resenaForm: FormGroup = this.fb.group({
    nombre_restaurante: ['', [Validators.required, Validators.maxLength(150)]],
    calificacion: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    fecha_visita: ['', [Validators.required]],
    observaciones: ['']
  });

  ngOnInit(): void {
    this.cargarResenas();
  }

  cargarResenas(): void {
    this.resenasService.obtenerResenas().subscribe({
      next: (data) => {
        this.resenas = data;
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al cargar tus reseñas.';
      }
    });
  }

  guardarResena(): void {
    if (this.resenaForm.invalid) return;
    this.mensaje = '';
    this.error = '';

    const datos: Resena = this.resenaForm.value;

    if (this.editandoId !== null) {
      this.resenasService.actualizarResena(this.editandoId, datos).subscribe({
        next: () => {
          this.mensaje = 'Reseña actualizada correctamente.';
          this.cancelarEdicion();
          this.cargarResenas();
        },
        error: (err) => {
          this.error = err.error?.mensaje || 'No se pudo actualizar la reseña.';
        }
      });
    } else {
      this.resenasService.crearResena(datos).subscribe({
        next: () => {
          this.mensaje = 'Reseña agregada correctamente.';
          this.resenaForm.reset({ calificacion: 5 });
          this.cargarResenas();
        },
        error: (err) => {
          this.error = err.error?.mensaje || 'No se pudo guardar la reseña.';
        }
      });
    }
  }

  seleccionarParaEditar(resena: Resena): void {
    this.editandoId = resena.id!;
    this.mensaje = '';
    this.error = '';
    this.resenaForm.patchValue({
      nombre_restaurante: resena.nombre_restaurante,
      calificacion: resena.calificacion,
      fecha_visita: resena.fecha_visita,
      observaciones: resena.observaciones
    });
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.resenaForm.reset({ calificacion: 5 });
  }

  eliminarResena(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta reseña?')) return;

    this.resenasService.eliminarResena(id).subscribe({
      next: () => {
        this.mensaje = 'Reseña eliminada.';
        if (this.editandoId === id) {
          this.cancelarEdicion();
        }
        this.cargarResenas();
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'No se pudo eliminar la reseña.';
      }
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
  }
}