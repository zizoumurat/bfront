import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable } from "rxjs";
import { NotificationHelper } from "../../helpers/notification/notification.helper";
import { TranslateService } from "@ngx-translate/core";

export const deleteInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method === 'DELETE') {
    const confirmationService = inject(ConfirmationService);
    const messageService = inject(MessageService);
      const translate = inject(TranslateService);
    const notificationHelper = new NotificationHelper(confirmationService, messageService, translate);

    return new Observable(observer => {
      notificationHelper.confirmDelete().then(confirmed => {
        if (confirmed) {
          next(req).subscribe({
            next: (event) => observer.next(event),
            error: (error) => observer.error(error),
            complete: () => observer.complete(),
          });
        } else {
          observer.unsubscribe();
          observer.complete();
        }
      });
    });
  } else {
    return next(req);
  }
};