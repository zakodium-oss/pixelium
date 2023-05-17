import { useCallback } from 'react';

import useData from '../hooks/useData';
import { INCREMENT } from '../state/data/actions/Types';

export default function Counter() {
  const {
    data: { counter },
    dispatch,
  } = useData();

  const increment = useCallback(() => {
    dispatch({ type: INCREMENT });
  }, [dispatch]);

  return (
    <div>
      <h1>Counter = {counter}</h1>
      <button type="button" onClick={increment}>
        Increment
      </button>
    </div>
  );
}
