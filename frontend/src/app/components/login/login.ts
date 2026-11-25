import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html', // Cambia a './login.component.html' si tu CLI usa .component
  styleUrl: './login.css'      // Cambia a './login.component.css' si tu CLI usa .component
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  modoRegistro = false;
  mensajeError = '';
  mensajeExito = '';
  cargando = false;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  registroForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  cambiarModo(esRegistro: boolean): void {
    this.modoRegistro = esRegistro;
    this.mensajeError = '';
    this.mensajeExito = '';
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;
    this.cargando = true;
    this.mensajeError = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/resenas']);
      },
      error: (err) => {
        this.cargando = false;
        this.mensajeError = err.error?.mensaje || 'Error al iniciar sesión.';
      }
    });
  }

  onRegister(): void {
    if (this.registroForm.invalid) return;
    this.cargando = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    this.authService.register(this.registroForm.value).subscribe({
      next: () => {
        this.cargando = false;
        this.mensajeExito = 'Cuenta creada exitosamente. Ahora inicia sesión.';
        this.registroForm.reset();
        this.modoRegistro = false;
      },
      error: (err) => {
        this.cargando = false;
        this.mensajeError = err.error?.mensaje || 'Error al registrar usuario.';
      }
    });
  }
}