import { useContext } from 'react';

import { DataContext } from '../components/context/DataContext';
import { DispatchContext } from '../components/context/DispatchContext';

export default function useData() {
  return {
    data: useContext(DataContext),
    dispatch: useContext(DispatchContext).data,
  };
}
