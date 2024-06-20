import {
  memo,
  ReactNode,
  useCallback,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { KbsProvider } from 'react-kbs';
import { RoiProvider } from 'react-roi';
import { RootLayout } from 'react-science/ui';

import useViewDispatch from '../hooks/useViewDispatch';
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
import { SET_PAN_ZOOM } from '../state/view/ViewActionTypes';
import {
  initialViewState,
  viewReducer,
  ViewState,
} from '../state/view/ViewReducer';

import { AnnotationsProvider } from './context/AnnotationsContext';
import { DataProvider } from './context/DataContext';
import { DispatchProvider } from './context/DispatchContext';
import { LogProvider } from './context/LogContext';
import { PipelineProvider } from './context/PipelineContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { initialROIState, ROIProvider, ROIReducer } from './context/ROIContext';
import { RootProvider } from './context/RootContext';
import { ViewProvider } from './context/ViewContext';

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
  const viewDispatch = useViewDispatch();

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

  const identifier = viewState.currentTab;

  const panZoom = useMemo(() => {
    if (
      view !== undefined &&
      identifier !== undefined &&
      view.imageViewerProps[identifier]
    ) {
      return view.imageViewerProps[identifier];
    } else {
      return {
        scale: 1,
        translation: [0, 0] as [number, number],
      };
    }
  }, [identifier, view]);

  const setPanZoom = useCallback(
    (panZoom) => {
      if (view !== undefined && identifier !== undefined) {
        viewDispatch({
          type: SET_PAN_ZOOM,
          payload: { identifier, panZoom },
        });
      }
    },
    [identifier, view, viewDispatch],
  );

  const dispatchers = useMemo(() => {
    return {
      data: dispatchData,
      preferences: dispatchPreferences,
      view: dispatchView,
      roi: dispatchROI,
    };
  }, [dispatchData, dispatchPreferences, dispatchView, dispatchROI]);

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
                      <ROIProvider value={roiState}>
                        <RoiProvider
                          initialConfig={{
                            zoom: {
                              initial: panZoom,
                              min: 0.1,
                              max: 30,
                              spaceAroundTarget: 0.1,
                            },
                            resizeStrategy: 'contain',
                            mode: 'select',
                          }}
                          onAfterZoomChange={setPanZoom}
                        >
                          <AnnotationsProvider>{children}</AnnotationsProvider>
                        </RoiProvider>
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
  );
}

export default memo(PixeliumProvider);
