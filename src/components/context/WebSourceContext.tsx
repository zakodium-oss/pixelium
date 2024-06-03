import { WebSource } from 'filelist-utils';
import React, { createContext, useContext, useState, useMemo } from 'react';

interface WebSourceContextProps {
  webSource: WebSource | undefined;
  setWebSource: (value: WebSource | undefined) => void;
}

const WebSourceContext = createContext<WebSourceContextProps | undefined>(
  undefined,
);

export function WebSourceProvider({ children }) {
  const [webSource, setWebSource] = useState<WebSource | undefined>();

  const value = useMemo(
    () => ({ webSource, setWebSource }),
    [webSource, setWebSource],
  );

  return (
    <WebSourceContext.Provider value={value}>
      {children}
    </WebSourceContext.Provider>
  );
}

export function useWebSource() {
  const context = useContext(WebSourceContext);
  if (context === undefined) {
    throw new Error('useWebSource must be used within a WebSourceProvider');
  }
  return context;
}
