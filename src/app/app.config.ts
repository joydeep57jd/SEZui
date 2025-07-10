import { ApplicationConfig } from '@angular/core';
import {provideRouter} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import {NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {DateParserFormatter} from "./lib/date-parser-formatter";
import {apiInterceptor} from ".";



export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
    ),
    provideHttpClient(withInterceptors([apiInterceptor])),
    {
      provide: NgbDateParserFormatter,
      useClass: DateParserFormatter
    },
  ],
};
