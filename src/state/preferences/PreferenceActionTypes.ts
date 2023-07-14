export type PreferenceActionType<Action, Payload = void> = Payload extends void
  ? { type: Action }
  : { type: Action; payload: Payload };

export const INITIALIZE_PREFERENCES = 'INITIALIZE_PREFERENCES';
export const SET_ROIS_COLUMNS = 'SET_ROIS_COLUMNS';
export const SET_ROIS_ANNOTATIONS = 'SET_ROIS_ANNOTATIONS';
