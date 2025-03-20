import { provideHttpClient, withFetch } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

export const appConfig = {
  providers: [
    provideHttpClient(withFetch()),
    importProvidersFrom(MatCardModule, MatToolbarModule),
    provideRouter(routes),
    importProvidersFrom(MatButtonModule)
  ]
};
