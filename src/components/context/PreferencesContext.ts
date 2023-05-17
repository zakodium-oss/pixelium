import { createContext } from 'react';

import {
  initialPreferencesState,
  PreferencesState,
} from '../../state/preferences/PreferencesReducer';

export const PreferencesContext = createContext<PreferencesState>(
  initialPreferencesState,
);

export const PreferencesProvider = PreferencesContext.Provider;
