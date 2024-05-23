import { createContext, Dispatch } from 'react';

import { DataActions } from '../../state/data/DataReducer';
import { PreferencesActions } from '../../state/preferences/PreferencesReducer';
import { ViewActions } from '../../state/view/ViewReducer';

import { ROIActions } from './ROIContext';

interface DispatchState {
  data: Dispatch<DataActions>;
  preferences: Dispatch<PreferencesActions>;
  view: Dispatch<ViewActions>;
  roi: Dispatch<ROIActions>;
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
  roi: () => {
    throw new Error('ROIContext not initialized');
  },
});

export const DispatchProvider = DispatchContext.Provider;
