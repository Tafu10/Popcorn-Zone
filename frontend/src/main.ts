import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // <-- 1. Importă configurația
import { AppComponent } from './app/app';

// 2. Adaugă 'appConfig' ca al doilea argument
bootstrapApplication(AppComponent, appConfig) 
  .catch((err) => console.error(err));