import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResenasService, Resena } from '../../services/resenas.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-resenas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './resenas.html', // Cambia a './resenas.component.html' si aplica
  styleUrl: './resenas.css'      // Cambia a './resenas.component.css' si aplica
})
export class ResenasComponent implements OnInit {
  private fb = inject(FormBuilder);
  private resenasService = inject(ResenasService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

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
        this.cdr.detectChanges(); // Fuerza el repintado inmediato al recargar la página
      },
      error: (err) => {
        console.error('Error al cargar reseñas:', err);
        this.error = err.error?.mensaje || 'Error al cargar tus reseñas.';
        this.cdr.detectChanges();
      }
    });
  }

  guardarResena(): void {
    if (this.resenaForm.invalid) return;
    this.mensaje = '';
    this.error = '';

    const datos: Resena = {
      ...this.resenaForm.value,
      calificacion: Number(this.resenaForm.value.calificacion)
    };

    if (this.editandoId !== null) {
      this.resenasService.actualizarResena(this.editandoId, datos).subscribe({
        next: () => {
          this.mensaje = 'Reseña actualizada correctamente.';
          this.cancelarEdicion();
          this.cargarResenas();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          this.error = err.error?.mensaje || 'No se pudo actualizar la reseña.';
          this.cdr.detectChanges();
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
          console.error('Error al crear:', err);
          this.error = err.error?.mensaje || 'No se pudo guardar la reseña.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  seleccionarParaEditar(resena: Resena): void {
    this.editandoId = resena.id ?? null;
    this.mensaje = '';
    this.error = '';

    // Asegura formato YYYY-MM-DD para que el input type="date" no quede vacío
    const fechaFormateada = resena.fecha_visita
      ? String(resena.fecha_visita).substring(0, 10)
      : '';

    this.resenaForm.patchValue({
      nombre_restaurante: resena.nombre_restaurante,
      calificacion: Number(resena.calificacion),
      fecha_visita: fechaFormateada,
      observaciones: resena.observaciones || ''
    });
    this.cdr.detectChanges();
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.resenaForm.reset({ calificacion: 5 });
    this.cdr.detectChanges();
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
        console.error('Error al eliminar:', err);
        this.error = err.error?.mensaje || 'No se pudo eliminar la reseña.';
        this.cdr.detectChanges();
      }
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
  }
}