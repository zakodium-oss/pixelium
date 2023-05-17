import { memo, useMemo, useReducer } from 'react';

import { dataReducer, initialDataState } from '../state/data/DataReducer';
import {
  initialPreferencesState,
  preferencesReducer,
} from '../state/preferences/PreferencesReducer';
import { initialViewState, viewReducer } from '../state/view/ViewReducer';

import Counter from './Counter';
import { DataProvider } from './context/DataContext';
import { DispatchProvider } from './context/DispatchContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { ViewProvider } from './context/ViewContext';

function Pixelium() {
  const [dataState, dispatchData] = useReducer(dataReducer, initialDataState);
  const [preferencesState, dispatchPreferences] = useReducer(
    preferencesReducer,
    initialPreferencesState,
  );
  const [viewState, dispatchView] = useReducer(viewReducer, initialViewState);

  const dispatchers = useMemo(() => {
    return {
      data: dispatchData,
      preferences: dispatchPreferences,
      view: dispatchView,
    };
  }, [dispatchData, dispatchPreferences, dispatchView]);

  return (
    <DataProvider value={dataState}>
      <PreferencesProvider value={preferencesState}>
        <ViewProvider value={viewState}>
          <DispatchProvider value={dispatchers}>
            <Counter />
          </DispatchProvider>
        </ViewProvider>
      </PreferencesProvider>
    </DataProvider>
  );
}

export default memo(Pixelium);
