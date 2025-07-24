import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ToastService } from 'src/app/services';
import {environment} from "../../../environments/environment";

export const apiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const toastService = inject(ToastService);
  const baseUrl = environment.apiBaseUrl;

  const updatedReq = req.clone({
    url: `${baseUrl}/${req.url}`,
  });

  return next(updatedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('🚨 HTTP Error:', {
        status: error.status,
        message: error.error?.message ?? error.message,
        url: error.url,
      });

      if (error.status === 401) {
        // redirectToLogin();
      } else {
        const errorObj = error.error?.errors;
        if (errorObj) {
          toastService.detailedError$.next(errorObj);
        }
        if(error.status !== 404) {
          toastService.showError(error.error?.message ?? error.error?.title ?? 'Something went wrong');
        }
      }
      return throwError(() => error);
    })
  );
};
