export class PaginationFilterModel {
    page: number = 0;
    sortBy: string;
    isSortAscending: number = 0;
    pageSize: number = 10;
    sortByMultiName: string[] = ['id'];
    sortByMultiOrder: number[] = [0];
}