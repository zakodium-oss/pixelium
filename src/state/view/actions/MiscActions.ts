import { Draft } from 'immer';

import { SET_EDIT_ROI_PREFERENCE, ViewActionType } from '../ViewActionTypes';
import { ViewState } from '../ViewReducer';

export type SetEditROIPreferenceAction = ViewActionType<
  typeof SET_EDIT_ROI_PREFERENCE,
  boolean
>;

export function setEditROIPreference(
  draft: Draft<ViewState>,
  payload: SetEditROIPreferenceAction['payload'],
) {
  draft.editROIPreference = payload;
}
