import { useContext } from 'react';

import { DispatchContext } from '../components/context/DispatchContext';

export default function usePreferencesDispatch() {
  return useContext(DispatchContext).preferences;
}
