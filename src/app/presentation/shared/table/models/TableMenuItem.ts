import { MenuItem } from 'primeng/api';

export interface TableMenuItem extends MenuItem {
  handleOptions?: (row: any, item: TableMenuItem) => void;
}