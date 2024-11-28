'use client';

import React, { createContext, useContext, useState } from 'react';

interface SelectedProductSampleUnitsContextType {
  productSampleUnitIds: number[];
  setProductSampleUnitIds: (ids: number[]) => void;
}

const SelectedProductSampleUnitsContext = createContext<
  SelectedProductSampleUnitsContextType | undefined
>(undefined);

export const SelectedProductSampleUnitsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [productSampleUnitIds, setProductSampleUnitIds] = useState<number[]>([]);

  return (
    <SelectedProductSampleUnitsContext.Provider
      value={{ productSampleUnitIds, setProductSampleUnitIds }}
    >
      {children}
    </SelectedProductSampleUnitsContext.Provider>
  );
};

export const useSelectedProductSampleUnits = (): SelectedProductSampleUnitsContextType => {
  const context = useContext(SelectedProductSampleUnitsContext);
  if (!context) {
    throw new Error(
      'useSelectedProductSampleUnits must be used within a SelectedProductSampleUnitsProvider',
    );
  }
  return context;
};
