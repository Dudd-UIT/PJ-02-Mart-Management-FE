'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from 'react';
import { useSession } from 'next-auth/react';

type SessionContextType = {
  currentSession: any;
  setCurrentSession: Dispatch<SetStateAction<any>>;
} | null;

const SessionContext = createContext<SessionContextType>(null);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const [currentSession, setCurrentSession] = useState<any>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      setCurrentSession(session);
    }
  }, [session, status]);

  return (
    <SessionContext.Provider value={{ currentSession, setCurrentSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }

  return context;
};
