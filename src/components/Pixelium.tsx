import { css } from '@emotion/react';
import { memo, useEffect, useMemo, useReducer, useRef } from 'react';
import { FaRegWindowMaximize, FaWrench, MdSettings } from 'react-icons/all';
import { DropZone, Header, RootLayout, Toolbar } from 'react-science/ui';
import { useFullscreen, useToggle } from 'react-use';

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

import { DataProvider } from './context/DataContext';
import { DispatchProvider } from './context/DispatchContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { ViewProvider } from './context/ViewContext';

interface PixeliumProps {
  data?: DataState;
  preferences?: PreferencesState;
  view?: ViewState;
}

const pixeliumContainerStyle = css`
  width: 100%;
  height: 100%;
  background-color: white;
`;

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

  const [show, toggle] = useToggle(false);

  const isFullScreen = useFullscreen(rootRef, show, {
    onClose: () => toggle(false),
  });

  return (
    <RootLayout>
      <DataProvider value={dataState}>
        <PreferencesProvider value={preferencesState}>
          <ViewProvider value={viewState}>
            <DispatchProvider value={dispatchers}>
              <div css={pixeliumContainerStyle} ref={rootRef}>
                <Header>
                  <Toolbar orientation="horizontal">
                    <span>Pixelium</span>
                  </Toolbar>
                  <Toolbar orientation="horizontal">
                    <Toolbar.Item title="Settings">
                      <FaWrench />
                    </Toolbar.Item>
                    {!isFullScreen && (
                      <Toolbar.Item title="Full Screen" onClick={toggle}>
                        <FaRegWindowMaximize />
                      </Toolbar.Item>
                    )}
                  </Toolbar>
                </Header>
              </div>
            </DispatchProvider>
          </ViewProvider>
        </PreferencesProvider>
      </DataProvider>
    </RootLayout>
  );
}

export default memo(Pixelium);
