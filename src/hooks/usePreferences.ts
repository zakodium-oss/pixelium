import { useContext } from 'react';

import { PreferencesContext } from '../components/context/PreferencesContext';

export default function usePreferences() {
  return useContext(PreferencesContext);
}
