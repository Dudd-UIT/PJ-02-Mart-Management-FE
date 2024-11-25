import { Batch } from './batch';
import { Column, MetaData } from './commonType';

export type InboundReceiptTransform = {
  id: number;
  staffName: string;
  supplierName: string;
  totalPrice: number;
  isReceived: number;
  isPaid: number;
  createdAt: string;
  staffId: number;
  supplierId: number;
  discount: number;
  vat: number;
  batchs: Batch[];
};

export type InboundReceipt = {
  id: number;
  totalPrice: number;
  isReceived: number;
  isPaid: string;
  discount: number;
  vat: number;
  createdAt: string;
  staff?: {
    id: number;
    name: string;
  };
  supplier?: {
    id: number;
    name: string;
  };
  batchs?: Batch[];
};

export interface InboundReceiptTableModalProps {
  inboundReceipts: InboundReceiptTransform[];
  columns: Column<InboundReceiptTransform>[];
  onMutate: () => void;
}

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
