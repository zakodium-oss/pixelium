import { css } from '@emotion/react';
import { memo, useCallback, useMemo, useReducer, useRef } from 'react';
import {
  DropZoneContainer,
  RootLayout,
  SplitPane,
  Toolbar,
} from 'react-science/ui';

import useDataDispatch from '../hooks/useDataDispatch';
import { SET_LOADING } from '../state/data/DataActionTypes';
import {
  dataReducer,
  DataState,
  initialDataState,
} from '../state/data/DataReducer';
import {
  initialPreferencesState,
  preferencesReducer,
  PreferencesState,
} from '../state/preferences/PreferencesReducer';
import {
  initialViewState,
  viewReducer,
  ViewState,
} from '../state/view/ViewReducer';

import CenterPanel from './CenterPanel';
import { DataProvider } from './context/DataContext';
import { DispatchProvider } from './context/DispatchContext';
import { GlobalProvider } from './context/GlobalContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { ViewProvider } from './context/ViewContext';
import DropZone from './dropzone/DropZone';
import Header from './header/Header';

interface PixeliumProps {
  data?: DataState;
  preferences?: PreferencesState;
  view?: ViewState;
}

const pixeliumContainerStyle = css`
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Pixelium({ data, preferences, view }: PixeliumProps) {
  // Refs
  const rootRef = useRef<HTMLDivElement>(null);

  // Populate contexts
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
    <RootLayout>
      <GlobalProvider value={{ rootRef }}>
        <DataProvider value={dataState}>
          <PreferencesProvider value={preferencesState}>
            <ViewProvider value={viewState}>
              <DispatchProvider value={dispatchers}>
                <div css={pixeliumContainerStyle} ref={rootRef}>
                  <Header />
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      height: '100%',
                    }}
                  >
                    <Toolbar orientation={'vertical'} />
                    <SplitPane direction="horizontal" size="80%">
                      <CenterPanel />
                      <div>Hello, world</div>
                    </SplitPane>
                  </div>
                </div>
              </DispatchProvider>
            </ViewProvider>
          </PreferencesProvider>
        </DataProvider>
      </GlobalProvider>
    </RootLayout>
  );
}

export default memo(Pixelium);
