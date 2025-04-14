import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, delay, finalize } from 'rxjs';
import { LoadingHelper } from '../../helpers/loading/loading.helper';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingHelper = inject(LoadingHelper);

  loadingHelper.show();

  return next(req).pipe(
    finalize(() => {
      loadingHelper.hide();
    })
  );
};