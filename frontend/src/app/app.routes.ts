import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';       // Ajusta a './components/login/login.component' si aplica
import { ResenasComponent } from './components/resenas/resenas'; // Ajusta a './components/resenas/resenas.component' si aplica
import { authGuard, loginGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'resenas', component: ResenasComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];