// 'use server';

import { ReactNode } from 'react';
import { useSessionContext } from '@/context/SessionContext';

interface ProtectedComponentProps {
  requiredRoles: string[];
  children: ReactNode;
}

const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  requiredRoles,
  children,
}) => {
  const { currentSession } = useSessionContext();

  if (!currentSession) return null;

  const userRoles: string[] = currentSession.user?.roles || [];
  const hasPermission = requiredRoles.some((role) => userRoles.includes(role));

  if (!hasPermission) return null;

  return <>{children}</>;
};

export default ProtectedComponent;
