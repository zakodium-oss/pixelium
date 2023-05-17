import { createContext, Dispatch } from 'react';

interface DispatchState {
  data: Dispatch<any>;
  preferences: Dispatch<any>;
  view: Dispatch<any>;
}
export const DispatchContext = createContext<DispatchState>({
  data: () => {
    throw new Error('DataContext not initialized');
  },
  preferences: () => {
    throw new Error('PreferencesContext not initialized');
  },
  view: () => {
    throw new Error('ViewContext not initialized');
  },
});

export const DispatchProvider = DispatchContext.Provider;
