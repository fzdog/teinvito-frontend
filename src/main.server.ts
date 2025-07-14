// main.server.ts
import { bootstrapApplication } from '@angular/platform-browser';
import {
    provideHttpClient,
    withFetch,
    withInterceptorsFromDi
} from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const serverConfig = {
    ...config,
    providers: [
        // Primero, todos los providers que ya tengas en config
        ...(config.providers ?? []),
        // Luego añade el provider de HttpClient para SSR
        provideHttpClient(
            withFetch(),               // habilita fetch() en lugar de XHR
            withInterceptorsFromDi()   // importa interceptores registrados en DI
        )
    ]
};

const bootstrap = () => bootstrapApplication(AppComponent, serverConfig);

export default bootstrap;
