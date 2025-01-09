import { Batch, BatchGrouped } from "./batch";
import { GroupedProductData } from "./commonType";
import { ProductLine } from "./productLine";
import { ProductSample } from "./productSample";
import { ProductType } from "./productType";
import { Product } from "./productUnit";

export interface WarehouseTableType {
  product: GroupedProductData;
  batches: BatchGrouped[];
  columnsBatch: Column<BatchGrouped>[];
  level: number;
  onMutate: () => void;
}