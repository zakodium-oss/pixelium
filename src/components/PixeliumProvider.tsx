import { memo, ReactNode, useMemo, useReducer, useRef } from 'react';
import { KbsProvider } from 'react-kbs';
import { RootLayout } from 'react-science/ui';

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
import { initialROIState, ROIProvider, ROIReducer } from './context/ROIContext';
import { RootProvider } from './context/RootContext';
import { ViewProvider } from './context/ViewContext';
import { WebSourceProvider } from './context/WebSourceContext';

interface PixeliumProps {
  data?: DataState;
  preferences?: PreferencesState;
  view?: ViewState;
  children: ReactNode;
}

function PixeliumProvider({
  data,
  preferences,
  view,
  children,
}: PixeliumProps) {
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
  const [roiState, dispatchROI] = useReducer(ROIReducer, initialROIState);

  const dispatchers = useMemo(() => {
    return {
      data: dispatchData,
      preferences: dispatchPreferences,
      view: dispatchView,
      roi: dispatchROI,
    };
  }, [dispatchData, dispatchPreferences, dispatchView, dispatchROI]);

  return (
    <WebSourceProvider>
      <RootLayout>
        <RootProvider value={{ rootRef }}>
          <KbsProvider>
            <LogProvider>
              <DataProvider value={dataState}>
                <PreferencesProvider value={preferencesState}>
                  <ViewProvider value={viewState}>
                    <DispatchProvider value={dispatchers}>
                      <PipelineProvider identifier={viewState.currentTab}>
                        <ROIProvider value={roiState}>
                          <AnnotationsProvider>
                            <AutoLoader>{children}</AutoLoader>
                          </AnnotationsProvider>
                        </ROIProvider>
                      </PipelineProvider>
                    </DispatchProvider>
                  </ViewProvider>
                </PreferencesProvider>
              </DataProvider>
            </LogProvider>
          </KbsProvider>
        </RootProvider>
      </RootLayout>
    </WebSourceProvider>
  );
}

export default memo(PixeliumProvider);
