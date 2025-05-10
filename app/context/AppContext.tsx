"use client";

import { createContext, useContext, ReactNode } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

interface AppContextType {
  address: string | undefined;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <AppContext.Provider
      value={{
        address,
        isConnected,
        connect: () => connect({ connector: injected() }),
        disconnect,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 