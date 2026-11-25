import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html', // O './app.component.html' según cómo se llame tu archivo
  styleUrl: './app.css'      // O './app.component.css'
})
export class AppComponent {} // O 'export class App' si así venía por defecto en main.ts