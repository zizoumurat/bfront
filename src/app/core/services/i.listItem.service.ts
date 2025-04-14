import { ListItemModel } from "../domain/listItem.model";

export interface IListItemService {
    getSelectedItemList(
        entityName: string,
        filters?: { [key: string]: string }
    ): Promise<ListItemModel[]>;

    getPublicSelectedItemList(
        entityName: string,
        filters?: { [key: string]: string }
    ): Promise<ListItemModel[]>;
}