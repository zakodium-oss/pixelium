import { useCallback } from 'react';

import useData from '../hooks/useData';
import useDataDispatch from '../hooks/useDataDispatch';
import { INCREMENT } from '../state/data/DataActionTypes';

export default function Counter() {
  const { counter } = useData();
  const dataDispatch = useDataDispatch();

  const increment = useCallback(() => {
    dataDispatch({ type: INCREMENT });
  }, [dataDispatch]);

  return (
    <div>
      <h1>Counter = {counter}</h1>
      <button type="button" onClick={increment}>
        Increment
      </button>
    </div>
  );
}
