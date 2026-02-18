import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { DatePipe } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CommonService } from './services/common.service';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    DatePipe,
    provideHttpClient(),
    provideAnimations(),
    provideToastr(),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    //  importProvidersFrom(
    //   BsDatepickerModule.forRoot()
    // ),
     providePrimeNG({
      theme: {
        preset: Aura
      }
    })
    
  ]
};
