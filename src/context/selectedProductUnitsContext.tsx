'use client';

import React, { createContext, useContext, useState } from 'react';

interface SelectedProductUnitsContextType {
  productUnitIds: number[];
  setProductUnitIds: (ids: number[]) => void;
}

const SelectedProductUnitsContext = createContext<
  SelectedProductUnitsContextType | undefined
>(undefined);

export const SelectedProductUnitsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [productUnitIds, setProductUnitIds] = useState<number[]>([]);

  return (
    <SelectedProductUnitsContext.Provider
      value={{ productUnitIds, setProductUnitIds }}
    >
      {children}
    </SelectedProductUnitsContext.Provider>
  );
};

export const useSelectedProductUnits = (): SelectedProductUnitsContextType => {
  const context = useContext(SelectedProductUnitsContext);
  if (!context) {
    throw new Error(
      'useSelectedProductUnits must be used within a SelectedProductUnitsProvider',
    );
  }
  return context;
};
