import { Draft } from 'immer';

import { ViewActionType } from '../ViewActionTypes';
import { ViewState } from '../ViewReducer';

interface PanZoomData {
  scale: number;
  translation: { x: number; y: number };
}

export type SetPanZoomAction = ViewActionType<
  'SET_PAN_ZOOM',
  {
    identifier: string;
    panZoom: PanZoomData;
  }
>;

export function setPanZoom(
  draft: Draft<ViewState>,
  { identifier, panZoom }: { identifier: string; panZoom: PanZoomData },
) {
  draft.imageViewerProps[identifier] = panZoom;
}
