export interface PaginationResponseModel<T> {
    index: number;
    size: number;
    resultType: number;
    count: number;
    pages: number;
    hasNext: boolean;
    hasPrevious: boolean;
    items: T[];
  }
  