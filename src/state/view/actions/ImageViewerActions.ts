import { Draft } from 'immer';

import { SET_PAN_ZOOM, ViewActionType } from '../ViewActionTypes';
import { ViewState } from '../ViewReducer';

interface PanZoomData {
  scale: number;
  translation: [number, number];
}

export type SetPanZoomAction = ViewActionType<
  typeof SET_PAN_ZOOM,
  {
    identifier: string;
    panZoom: PanZoomData;
  }
>;

export function setPanZoom(
  draft: Draft<ViewState>,
  { identifier, panZoom }: SetPanZoomAction['payload'],
) {
  draft.imageViewerProps[identifier] = panZoom;
}
