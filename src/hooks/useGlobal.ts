import { useContext } from 'react';

import { RootContext } from '../components/context/RootContext';

export default function useRoot() {
  const state = useContext(RootContext);
  if (!state) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return state;
}
