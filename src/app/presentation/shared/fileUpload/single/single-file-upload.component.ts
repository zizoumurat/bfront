import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-single-file-upload',
  templateUrl: './single-file-upload.component.html',
})
export class SingleFileUploadComponent {
  @Input() acceptTypes: string = ".pdf,.xls,.xlsx,.doc,.docx,.jpg,.png";
  @Output() fileUploaded = new EventEmitter<File | null>();
  uploadedFile: File | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedFile = input.files[0];
      this.fileUploaded.emit(this.uploadedFile);
    }
  }

  onRemoveFile(): void {
    this.uploadedFile = null;
    this.fileUploaded.emit(null);
  }

  getFileIcon(): string {
    if (!this.uploadedFile) return '';
    const fileType = this.uploadedFile.type;

    if (fileType.includes('pdf')) return 'pi-file-pdf';
    if (fileType.includes('word') || fileType.includes('msword') || fileType.includes('officedocument.wordprocessingml.document')) {
      return 'pi-file-word';
    }
    if (fileType.includes('excel') || fileType.includes('spreadsheetml.sheet')) return 'pi-file-excel';
    if (fileType.includes('image')) return 'pi-image';
    return 'pi-file';
  }
}
