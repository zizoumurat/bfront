import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormatEnum } from '../enums/format.enum';
import { ContractStatusEnum, RequestStateEnum } from '../enums/request.enum';

@Pipe({
    name: 'formatColumn'
})
export class FormatColumnPipe implements PipeTransform {
    constructor(private translate: TranslateService, private sanitizer: DomSanitizer) {

    }

    transform(value: any, formatType?: FormatEnum, parameter?: any): string | SafeHtml {
        switch (formatType) {
            case FormatEnum.currency:
                return new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: parameter ?? "TRY",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4
                }).format(value);
            case FormatEnum.date:
                return value ? new Date(value).toLocaleDateString('tr-TR') : '';
            case FormatEnum.yesNo:
                return this.translate.instant(value ? "yes" : "no");
            case FormatEnum.week:
                return `${value} ${this.translate.instant('week')}`;
            case FormatEnum.day:
                return `${value} ${this.translate.instant('day')}`;
            case FormatEnum.userList:
                return this.getUserListTemplate(value)
            case FormatEnum.budgetInclusionStatus:
                return this.getStatus(value, value ? 'inBudget' : 'outBudget');
            case FormatEnum.approvalStatus:
                return this.getApprovalStatus(value);
            case FormatEnum.dateTime:
                return value ? new Date(value).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }) : '';
            case FormatEnum.startStatu:
                const [startDate, endDate] = value.map(date => new Date(date));
                const now = new Date();

                if (now < startDate) {
                    return this.getTagHtml('bg-yellow-200', 'text-yellow-900', 'notStarted');
                } else if (now >= startDate && now <= endDate) {
                    return this.getTagHtml('bg-red-200', 'text-red-900', 'inProgress');
                } else if (now > endDate) {
                    return this.getTagHtml('bg-green-200', 'text-green-900', 'finished');
                }

                return ''
            case FormatEnum.participantList:
                return this.getParticipantList(value);

            case FormatEnum.percentage:
                return this.getPercentage(value);

            case FormatEnum.requestState:
                    return this.getRequestState(value);

            case FormatEnum.contractState:
                        return this.getContractState(value);
            default:
                return value;
        }
    }

    private getParticipantList(participants: { name: string; status: number }[]): string {
        const statusIcons: Record<number, { icon: string, tooltip: string, color: string }> = {
            0: { icon: "pi pi-question", tooltip: "Bilinmiyor", color: "text-gray-500" },
            1: { icon: "pi pi-check", tooltip: "Onaylandı", color: 'text-green-500', },
            2: { icon: "pi pi-times", tooltip: "Reddedildi", color: 'text-red-500' },
        };

        return participants.map(participant => {
            const { icon, tooltip, color } = statusIcons[participant.status] || { icon: "pi pi-question", tooltip: "Bilinmiyor", color: "gray" };


            return `
                <div class="participant-container">
                    <span>${participant.name}</span>
                    <span style="position: relative;">
                        <i 
                            class="${icon} ${color}" 
                            title="${tooltip}"></i>
                    </span>
                </div>
            `;
        }).join('');
    }

    private getUserListTemplate(userList: string[]) {
        return userList.map(user => `
            <span class="p-tag p-component mb-1 text-primary-900">
                <span class="p-tag-value">${user}</span>
            </span>
        `).join('');
    }

    private getStatus(value, text): string {
        if (value)
            return `<span class="p-tag bg-green-200 p-component mb-1 text-green-900">
                <span class="p-tag-value">${this.translate.instant(text)}</span>
            </span>`

        return `<span class="p-tag p-component mb-1 bg-red-200 text-red-900">
                <span class="p-tag-value">${this.translate.instant(text)}</span>
            </span>`
    }

    private getApprovalStatus(value): string {
        if (value == 1)
            return `<span class="p-tag bg-yellow-200 p-component mb-1 text-yellow-900">
                <span class="p-tag-value">${this.translate.instant('approvalProcessPending')}</span>
            </span>`

        if (value == 2)
            return `<span class="p-tag bg-green-200 p-component mb-1 text-green-900">
                    <span class="p-tag-value">${this.translate.instant('approvalProcessCompleted')}</span>
                </span>`

        return `<span class="p-tag p-component mb-1 bg-red-200 text-red-900">
                <span class="p-tag-value">${this.translate.instant('rejected')}</span>
            </span>`
    }

    private getTagHtml = (bgColor, textColor, text) => {
        return `
            <span class="p-tag ${bgColor} p-component mb-1 ${textColor}">
                <span class="p-tag-value">${this.translate.instant(text)}</span>
            </span>
        `;
    };

    private getPercentage(value) {

        if (value === 0)
            return '-';

        const bgCcolor = value < 0 ? 'bg-orange-200' : 'bg-green-200';
        const textColor = value < 0 ? 'text-orange-800' : 'text-green-800';

        value = value < 0 ? `<i class='pi pi-arrow-down mr-1'></i>%${value * -1}` : `<i class='pi pi-arrow-up mr-1'></i>%${value}`;

        return this.getTagHtml(bgCcolor, textColor, value.toString())
    }

    private getRequestState(value): string {
        switch (value) {
            case RequestStateEnum.NotStarted:
                return this.createTag('bg-yellow-200', 'text-yellow-900', this.translate.instant('Teklif Toplama Süreci Başlamadı'));
            case RequestStateEnum.Started:
                return this.createTag('bg-yellow-200', 'text-yellow-900', this.translate.instant('Teklif Toplama Süreci Başlatıldı'));
            case RequestStateEnum.ComparisonTableCreated:
                return this.createTag('bg-green-200', 'text-green-900', this.translate.instant('Karşılaştırma Tablosu Oluşturuldu'));
            case RequestStateEnum.AllocationCreated:
                return this.createTag('bg-green-200', 'text-green-900', this.translate.instant('Alokasyon Yapıldı'));
            case RequestStateEnum.ReverseAuctionPending:
                return this.createTag('bg-yellow-200', 'text-yellow-900', this.translate.instant('Ters Açık Artırma Bekleniyor'));
            case RequestStateEnum.ReverseAuctionComplated:
                return this.createTag('bg-green-200', 'text-green-900', this.translate.instant('Ters Açık Artırma Tamamlandı'));
            case RequestStateEnum.ComparisonTableCompleted:
                return this.createTag('bg-green-200', 'text-green-900', this.translate.instant('Karşılaştırma Tablosu Oluşturuldu'));
            case RequestStateEnum.PendingApprovals:
                return this.createTag('bg-yellow-200', 'text-yellow-900', this.translate.instant('Onay Süreci Devam Ediyor'));
            case RequestStateEnum.Approved:
                return this.createTag('bg-green-200', 'text-green-900', this.translate.instant('Onaylandı'));
            case RequestStateEnum.Rejected:
                return this.createTag('bg-red-200', 'text-red-900', this.translate.instant('Reddedildi'));
            case RequestStateEnum.Cancelled:
                return this.createTag('bg-red-200', 'text-red-900', this.translate.instant('İptal Edildi'));
            case RequestStateEnum.Completed:
                return this.createTag('bg-green-200', 'text-green-900', this.translate.instant('Tamamlandı'));
            default:
                return this.createTag('bg-gray-200', 'text-gray-900', this.translate.instant('Bilinmeyen Durum'));
        }
    }

    private getContractState(value): string {
        switch (value) {
            case ContractStatusEnum.NotStarted:
                return this.createTag('bg-yellow-200', 'text-yellow-900', this.translate.instant('Sözleşme Dosyası Yüklenmedi'));
            case ContractStatusEnum.Started:
                return this.createTag('bg-yellow-200', 'text-yellow-900', this.translate.instant('Sözleşme Dosyası Yüklendi'));
            case ContractStatusEnum.OfferApproved:
                return this.createTag('bg-green-200', 'text-green-900', this.translate.instant('Tedarikçi Sözleşmeyi Onayladı'));
            case ContractStatusEnum.OfferRejected:
                return this.createTag('bg-green-200', 'text-green-900', this.translate.instant('Tedarikçi Sözleşmeyi Reddetti'));
            case ContractStatusEnum.PendingApprovals:
                return this.createTag('bg-yellow-200', 'text-yellow-900', this.translate.instant('Onaylayıcılar Bekleniyor'));
            case ContractStatusEnum.ContractApproved:
                return this.createTag('bg-green-200', 'text-green-900', this.translate.instant('Sözleşme Onaylandı'));
            default:
                return this.createTag('bg-gray-200', 'text-gray-900', this.translate.instant('Bilinmeyen Durum'));
        }
    }
    
    private createTag(bgColor: string, textColor: string, text: string): string {
        return `<span class="p-tag ${bgColor} p-component mb-1 ${textColor}">
                    <span class="p-tag-value">${text}</span>
                </span>`;
    }
}
