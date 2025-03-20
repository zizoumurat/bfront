import { Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationHelper {

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService, private translate: TranslateService) { }

  showErrorConfirm(message: string) {
    this.confirmationService.confirm({
      header: 'Bir Hata Oluştu',
      message: this.translate.instant(message),
      icon: 'pi pi-times',
      key: 'errorConfirm',
      rejectVisible: false
    });
  }

  showSuccess(message: string) {
    this.messageService.add({
      severity: "success",
      summary: "Başarılı",
      detail: this.translate.instant(message),
    });
  }

  showError(message: string) {
    this.messageService.add({
      severity: "error",
      summary: "Hata",
      detail: this.translate.instant(message)
    });
  }

  confirmDelete(): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmationService.confirm({
        key: 'deleteConfirm',
        header: 'Emin misiniz?',
        message: 'Silme işlemi onaylanırsa bu veri kalıcı olarak silinecektir.',
        accept: () => {
          resolve(true);
        },
        reject: () => {
          resolve(false);
        }
      });
    });
  }
}
