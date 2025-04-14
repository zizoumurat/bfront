import { CanActivateFn, Router } from '@angular/router';
import { AuthHelper } from '../../helpers/auth/auth.helper';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authHelper = inject(AuthHelper);
  if (state?.url.includes('management')) {
    return authHelper.getCurrentUser().operationOfRole.includes('adminPanel.create') || authHelper.getCurrentUser().operationOfRole.includes('adminPanel.read');
  }
  const router = inject(Router);
  if (authHelper.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/auth/login']);
    return false;
  }
};