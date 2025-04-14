import { HttpInterceptorFn, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { catchError, of, tap, throwError } from "rxjs";
import { NotificationHelper } from "../../helpers/notification/notification.helper";
import { TranslateService } from '@ngx-translate/core';


export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const excludedUrlList = ['/auth/forgot-password'];

  if (excludedUrlList.some(url => req.url.includes(url))) {
    return next(req);
  }

  const confirmationService = inject(ConfirmationService);
  const translate = inject(TranslateService);
  const messageService = inject(MessageService);
  const router = inject(Router); // Router service for logout navigation
  const notificationService = new NotificationHelper(confirmationService, messageService,translate);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.clear(); // Clear local storage (if used for tokens)
        router.navigate(['/auth/login']); // Redirect to login page
      }
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Hata: ${error.error.message}`;
      } else {
        errorMessage = error?.error?.Message || 'Bilinmeyen bir hata oluştu.';
      }

      notificationService.showError(errorMessage);

      return throwError(() => error);
    }),
    tap((response) => {
      if (response instanceof HttpResponse && response.body) {
        const body = response.body as { message?: string };
        if (body.message) {
          const successMessage = body.message;
          notificationService.showSuccess(successMessage);
        }
      }
    })
  );
};
