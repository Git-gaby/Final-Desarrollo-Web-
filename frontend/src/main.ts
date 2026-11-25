import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app'; // Mantén el nombre de clase que ya tenías aquí (App o AppComponent)

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));