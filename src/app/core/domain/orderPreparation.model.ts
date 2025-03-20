export interface OrderPreparationModel {
  id: number;
  requestId: number;
  offerId: number;
  mainCategory: string;
  subCategory: string;
  requestGroup: string;
  requestCode: string;
  referenceCode: string;
  totalPrice: number;
  availableLimit: boolean;
  orders: OrderListModel[];
  offerDetailList: OfferDetailListModel[];
}

export interface OfferDetailListModel {
  id: number;
  productDefinition: string;
}

export interface OrderListModel {
  id: number;
  orderCode: string;
  totalPrice: number;
  status: OrderStatusEnum;
  orderItems: OrderItemListModel[];
  orderPreparation: OrderPreparationModel;
}

export interface OrderItemListModel {
  id: number;
  offerDetailId: number;
  productDefinition: string;
  unitPrice: number;
  totalPrice: number;
  quantity: number;
}

export enum OrderStatusEnum {
  OrderPending = 0,
  OrderCancelled = 1,
  InProduction = 2,
  InShipment = 3,
  Shipped = 4,
  Delivered = 5,
  NonconformityReported = 6,
  OrderCompleted = 7
}


export enum NonconformityReasonEnum {
  ProductQualityIssue = 0,       // Ürün Kalite Problemi
  PackagingQualityIssue = 1,     // Paketleme Kalite Problemi
  ShipmentQualityIssue = 2,      // Sevkiyat Kalite Problemi
  MissingProductShipment = 3,    // Eksik Ürün Sevkiyatı
  ExcessProductShipment = 4,     // Fazla Ürün Sevkiyatı
  OccupationalSafetyIssue = 5,   // İş Güvenliği Uygunsuzluğu
  Other = 6                      // Diğer
}
