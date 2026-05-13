import { ApplicationConfig, DEFAULT_CURRENCY_CODE, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura'; // Tu peux choisir Aura ou Lara
import { MessageService } from 'primeng/api';
import localeBe from '@angular/common/locales/fr-BE'; // Import des données belges
import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './auth/core/auth.interceptor';

registerLocaleData(localeBe);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-BE' }, // Formatage français
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' }, // Euro par défaut

    // HttpClient + interceptors
    provideHttpClient(withInterceptorsFromDi()),

    // Interceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },

    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    providePrimeNG({
      theme: {
        preset: Aura // C'est ici que le "look" est défini
      }
    }),
    MessageService
  ]
};
