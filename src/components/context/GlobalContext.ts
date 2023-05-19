import { createContext, RefObject } from 'react';

export interface GlobalState {
  rootRef: RefObject<HTMLDivElement>;
}

export const GlobalContext = createContext<GlobalState | null>(null);

export const GlobalProvider = GlobalContext.Provider;
