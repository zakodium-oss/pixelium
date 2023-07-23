import styled from '@emotion/styled';
import { WebSource } from 'filelist-utils';
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

import AutoLoader from './AutoLoader';
import { AnnotationsProvider } from './context/AnnotationsContext';
import { DataProvider } from './context/DataContext';
import { DispatchProvider } from './context/DispatchContext';
import { LogProvider } from './context/LogContext';
import { PipelineProvider } from './context/PipelineContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { RootProvider } from './context/RootContext';
import { ViewProvider } from './context/ViewContext';
import CenterPanel from './layout/CenterPanel';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import ModalContainer from './modal/ModalContainer';
import CloseTool from './tool/CloseTool';
import ExportTool from './tool/ExportTool';
import GreyTool from './tool/FilterTool';
import GeometryTool from './tool/GeometryTool';
import ImportTool from './tool/ImportTool';
import MaskTool from './tool/MaskTool';
import MorphologyTool from './tool/MorphologyTool';
import ROITool from './tool/ROITool';

const PixeliumStyle = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
`;

interface PixeliumProps {
  data?: DataState;
  preferences?: PreferencesState;
  view?: ViewState;
  webSource?: WebSource;
}

const PixeliumMainStyle = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  overflow: hidden;
`;

function Pixelium({ data, preferences, view, webSource }: PixeliumProps) {
  // Refs
  const rootRef = useRef<HTMLDivElement>(null);

  // Populate contexts
  const [dataState, dispatchData] = useReducer(
    dataReducer,
    data ?? initialDataState,
  );
  const [preferencesState, dispatchPreferences] = useReducer(
    preferencesReducer,
    preferences ?? initialPreferencesState,
  );
  const [viewState, dispatchView] = useReducer(
    viewReducer,
    view ?? initialViewState,
  );

  const dispatchers = useMemo(() => {
    return {
      data: dispatchData,
      preferences: dispatchPreferences,
      view: dispatchView,
    };
  }, [dispatchData, dispatchPreferences, dispatchView]);

  return (
    <RootLayout>
      <RootProvider value={{ rootRef }}>
        <KbsProvider>
          <LogProvider>
            <DataProvider value={dataState}>
              <PreferencesProvider value={preferencesState}>
                <ViewProvider value={viewState}>
                  <DispatchProvider value={dispatchers}>
                    <PipelineProvider identifier={viewState.currentTab}>
                      <AnnotationsProvider>
                        <AutoLoader webSource={webSource}>
                          <PixeliumStyle ref={rootRef}>
                            <Header />
                            <PixeliumMainStyle>
                              <Toolbar orientation="vertical">
                                <ImportTool />
                                <ExportTool />
                                <GreyTool />
                                <MaskTool />
                                <MorphologyTool />
                                <GeometryTool />
                                <ROITool />
                                <CloseTool />
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
                            </PixeliumMainStyle>
                          </PixeliumStyle>
                        </AutoLoader>
                      </AnnotationsProvider>
                    </PipelineProvider>
                  </DispatchProvider>
                </ViewProvider>
              </PreferencesProvider>
            </DataProvider>
          </LogProvider>
        </KbsProvider>
      </RootProvider>
    </RootLayout>
  );
}

export default memo(Pixelium);
