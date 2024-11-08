import { Column, MetaData } from './commonType';
import { ProductUnit } from './productUnit';

export type InboundReceiptCreate = {
  id: number;
  totalPrice: number; //inbound-receipt
  staffId: string; //inbound-receipt
  supplierId: string; //inbound-receipt
  discount: number; //inbound-receipt*
  inbound_price: number; //batch
  // sell_price: number; //batch
  inbound_quantity: number; //batch
  totalPriceBatch: number; //batch
  expiredAt: Date; //batch
  productSampleName: string; //batch
  unitName: string; //batch
};

export type Batch = {
  id: number;
  inbound_price: number;
  discount: number;
  invent_quantity: number;
  inbound_quantity: number;
  expiredAt: string;
  createdAt: string;
  productUnit: ProductUnit;
};

// export type InboundReceipt = {
//   id: number;
//   staff?: {
//     name: string;
//   };
//   supplier?: {
//     name: string;
//   };
//   totalPrice: number;
//   isReceived: number;
//   isPaid: string;
//   createdAt: string;
// };

// export interface InboundReceiptTableModalProps {
//   inboundReceipts: InboundReceiptTransform[];
//   columns: Column<InboundReceiptTransform>[];
//   onMutate: () => void;
// }

// export interface ProductSupplierModalProps {
//   isProductSupplierModalOpen: boolean;
//   setIsProductSupplierModalOpen: (v: boolean) => void;
//   onSelectedInboundReceiptsChange: (v: number[]) => void;
// }

// export interface SelectedInboundReceiptTableModalProps {
//   InboundReceipts: InboundReceiptTransform[];
//   columns: Column<InboundReceiptTransform>[];
//   // meta: MetaData;
// }
