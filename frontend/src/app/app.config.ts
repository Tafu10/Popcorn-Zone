import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes'; // Importă rutele tale

// --- Importuri ADĂUGATE de tine ---
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Vei avea nevoie de asta în componente

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // --- Servicii ADĂUGATE de tine ---
    provideHttpClient() // Adaugă suportul pentru cereri HTTP
  ]
};

