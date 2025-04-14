import { NotificationModel } from "../domain/notification.model";

export interface INotificationService {
    getAll(): Promise<NotificationModel[]>;
}