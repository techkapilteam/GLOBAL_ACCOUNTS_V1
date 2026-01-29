import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { DatePipe } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CommonService } from './services/common.service';

export const appConfig: ApplicationConfig = {
  providers: [
     DatePipe,
         provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    CommonService
  ]
};
