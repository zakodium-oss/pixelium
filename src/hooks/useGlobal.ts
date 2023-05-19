import { useContext } from 'react';

import { GlobalContext } from '../components/context/GlobalContext';

export default function useGlobal() {
  const state = useContext(GlobalContext);
  if (!state) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return state;
}
