import { css } from '@emotion/react';
import { memo, useMemo, useReducer, useRef } from 'react';
import { KbsProvider } from 'react-kbs';
import { RootLayout, SplitPane, Toolbar } from 'react-science/ui';

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
import Header from './Header';
import Sidebar from './Sidebar';
import { AnnotationsProvider } from './context/AnnotationsContext';
import { DataProvider } from './context/DataContext';
import { DispatchProvider } from './context/DispatchContext';
import { GlobalProvider } from './context/GlobalContext';
import { LogProvider } from './context/LogContext';
import { PipelineProvider } from './context/PipelineContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { ViewProvider } from './context/ViewContext';
import ModalContainer from './modal/ModalContainer';
import ExportTool from './tools/ExportTool';
import GreyTool from './tools/FilterTool';
import ImportTool from './tools/ImportTool';
import MaskTool from './tools/MaskTool';
import MorphologyTool from './tools/MorphologyTool';
import ROITool from './tools/ROITool';

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
        <KbsProvider>
          <LogProvider>
            <DataProvider value={dataState}>
              <PreferencesProvider value={preferencesState}>
                <ViewProvider value={viewState}>
                  <DispatchProvider value={dispatchers}>
                    <PipelineProvider identifier={viewState.currentTab}>
                      <AnnotationsProvider>
                        <div css={pixeliumContainerStyle} ref={rootRef}>
                          <Header />
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              height: '100%',
                              overflow: 'hidden',
                            }}
                          >
                            <Toolbar orientation="vertical">
                              <ImportTool />
                              <ExportTool />
                              <GreyTool />
                              <MaskTool />
                              <MorphologyTool />
                              <ROITool />
                              <ModalContainer />
                            </Toolbar>
                            <SplitPane
                              direction="horizontal"
                              size="20%"
                              controlledSide="end"
                            >
                              <CenterPanel />
                              <Sidebar />
                            </SplitPane>
                          </div>
                        </div>
                      </AnnotationsProvider>
                    </PipelineProvider>
                  </DispatchProvider>
                </ViewProvider>
              </PreferencesProvider>
            </DataProvider>
          </LogProvider>
        </KbsProvider>
      </GlobalProvider>
    </RootLayout>
  );
}

export default memo(Pixelium);
