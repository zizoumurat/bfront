import { HttpInterceptorFn } from '@angular/common/http';
import { AuthHelper } from '../../helpers/auth/auth.helper';
import { inject } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const excludedUrl = 'https://api.exchangerate-api.com/v4/latest/';

  if (req.url.startsWith(excludedUrl)) {
    return next(req);
  }

  const confirmationService = new ConfirmationService();

  const authHelper = inject(AuthHelper)

  const token = authHelper.getToken();

  confirmationService.confirm({
    message: 'Bu kaydı silmek istediğinize emin misiniz?',
    header: 'Onay',
    icon: 'pi pi-exclamation-triangle',
  });

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }
  return next(req);
};
