import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SideNavContextType {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  // Legacy methods for backward compatibility
  toggleSideNav: () => void;
  setSideNavOpen: (open: boolean) => void;
}

const SideNavContext = createContext<SideNavContextType | undefined>(undefined);

interface SideNavProviderProps {
  children: ReactNode;
}

export const SideNavProvider: React.FC<SideNavProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false); // Default to closed for mobile

  const toggleSideNav = () => {
    setIsOpen(prev => !prev);
  };

  const setSideNavOpen = (open: boolean) => {
    setIsOpen(open);
  };

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = toggleSideNav;

  const value = {
    isOpen,
    toggle,
    open,
    close,
    // Legacy methods for backward compatibility
    toggleSideNav,
    setSideNavOpen,
  };

  return (
    <SideNavContext.Provider value={value}>
      {children}
    </SideNavContext.Provider>
  );
};

export const useSideNav = () => {
  const context = useContext(SideNavContext);
  if (context === undefined) {
    throw new Error('useSideNav must be used within a SideNavProvider');
  }
  return context;
};