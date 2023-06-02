import { useContext } from 'react';

import { LogContext } from '../components/context/LogContext';

export default function useLog() {
  const state = useContext(LogContext);
  if (!state) {
    throw new Error('useLog must be used within a LogProvider');
  }
  return state;
}
