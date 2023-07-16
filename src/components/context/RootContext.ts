import { createContext, RefObject } from 'react';

export interface RootState {
  rootRef: RefObject<HTMLDivElement>;
}

export const RootContext = createContext<RootState | null>(null);

export const RootProvider = RootContext.Provider;
