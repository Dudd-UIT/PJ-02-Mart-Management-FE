export interface CartDetailItem {
    id: number;
    quantity: number;
    productUnit: {
      image: string;
      sellPrice: number;
      volumne: string;
      productSample: {
        name: string;
      };
      batches: Array<{
        discount: number;
        inventQuantity: number;
        expiredAt: string;
      }>;
      unit: {
        name: string;
      };
    };
  }