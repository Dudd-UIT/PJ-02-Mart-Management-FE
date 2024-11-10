'use client';

import React, { createContext, useContext, useState } from 'react';

interface SelectedRolesContextType {
  roleIds: number[];
  setRoleIds: (ids: number[]) => void;
}

const SelectedRolesContext = createContext<
  SelectedRolesContextType | undefined
>(undefined);

export const SelectedRolesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [roleIds, setRoleIds] = useState<number[]>([]);

  return (
    <SelectedRolesContext.Provider value={{ roleIds, setRoleIds }}>
      {children}
    </SelectedRolesContext.Provider>
  );
};

export const useSelectedRoles = (): SelectedRolesContextType => {
  const context = useContext(SelectedRolesContext);
  if (!context) {
    throw new Error(
      'useSelectedRoles must be used within a SelectedRolesProvider',
    );
  }
  return context;
};
