import { Column, MetaData } from './commonType';
import { InboundReceipt } from './inboundReceipt';
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
  inboundReceipt?: InboundReceipt;
  productUnit: ProductUnit;
};

export type BatchGrouped = {
  id: number;
  inboundPrice: number;
  sellPrice: number;
  discount: number;
  inventQuantity: number;
  inboundQuantity: number;
  expiredAt: string;
  createdAt: string;
  inboundReceiptId: number;
  unit: string;
  unitId: number;
  image: string;
  productSample: string;
  supplierName: string;
  uniqueUnitKey: string;
};

export interface BatchTableType {
  batches: BatchGrouped[];
  columns: Column<BatchGrouped>[];
  onMutate: () => void;
}

export interface SelectBatchModalProps {
  isModalOpen: boolean;
  onCloseModal: () => void;
  onSelectBatch: (batch: Batch) => void;
  batches: Batch[];
  columns: Column<Batch>[];
}
