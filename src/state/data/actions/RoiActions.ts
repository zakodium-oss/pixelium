import { Roi } from 'image-js';
import { Draft } from 'immer';

import { DataActionType, SET_ROI } from '../DataActionTypes';
import { DataState } from '../DataReducer';

export type SetROIAction = DataActionType<
  typeof SET_ROI,
  { identifier: string; rois: Roi[] }
>;

export function setROIs(
  draft: Draft<DataState>,
  payload: { identifier: string; rois: Roi[] },
) {
  draft.images[payload.identifier].rois = payload.rois;
}
