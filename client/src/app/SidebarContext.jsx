import { createContext, useContext, useMemo, useState } from 'react';

const SidebarContext = createContext(null);

function readInitialCollapsedState() {
  const saved = localStorage.getItem('synapse_sidebar_collapsed');
  return saved === '1';
}

function readInitialInsightsCollapsedState() {
  const saved = localStorage.getItem('synapse_insights_collapsed');
  return saved === '1';
}

export function SidebarProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(readInitialCollapsedState);
  const [isInsightsCollapsed, setIsInsightsCollapsed] = useState(readInitialInsightsCollapsedState);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('synapse_sidebar_collapsed', next ? '1' : '0');
      return next;
    });
  };

  const toggleInsightsCollapsed = () => {
    setIsInsightsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('synapse_insights_collapsed', next ? '1' : '0');
      return next;
    });
  };

  const value = useMemo(
    () => ({
      isCollapsed,
      setIsCollapsed,
      toggleCollapsed,
      isInsightsCollapsed,
      setIsInsightsCollapsed,
      toggleInsightsCollapsed,
    }),
    [isCollapsed, isInsightsCollapsed],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebarState() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebarState must be used within SidebarProvider');
  }
  return context;
}
