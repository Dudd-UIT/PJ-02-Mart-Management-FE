import { Column, MetaData } from './commonType';
import { ProductUnit } from './productUnit';

export type InboundReceiptCreate = {
  id: number;
  totalPrice: number; //inbound-receipt
  staffId: string; //inbound-receipt
  supplierId: string; //inbound-receipt
  discount: number; //inbound-receipt*
  inboundPrice: number; //batch
  // sellPrice: number; //batch
  inboundQuantity: number; //batch
  totalPriceBatch: number; //batch
  expiredAt: Date; //batch
  productSampleName: string; //batch
  unitName: string; //batch
};

export type Batch = {
  id: number;
  inboundPrice: number;
  sellPrice?: number;
  discount: number;
  inventQuantity: number;
  inboundQuantity: number;
  expiredAt: string;
  createdAt: string;
  inboundReceipt?: {
    id: number;
  };
  productUnit: ProductUnit;
};

export type BatchGrouped = {
  id: number;
  inboundPrice: number;
  sellPrice?: number;
  discount: number;
  inventQuantity: number;
  inboundQuantity: number;
  expiredAt: string; 
  inboundReceiptId?: number; 
  unit?: string;
  productSample?: string;
};

export interface BatchTableType {
  batches: BatchGrouped[];
  columns: Column<BatchGrouped>[];
  onMutate: () => void;
}


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
