export type ViewActionType<Action, Payload = void> = Payload extends void
  ? { type: Action }
  : { type: Action; payload: Payload };

export const OPEN_TAB = 'OPEN_TAB';
export const CLOSE_TAB = 'CLOSE_TAB';
export const SET_PAN_ZOOM = 'SET_PAN_ZOOM';
export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';
export const SET_EDIT_MODE_IDENTIFIER = 'SET_EDIT_MODE_IDENTIFIER';

export const SET_EDIT_ROI_PREFERENCE = 'SET_EDIT_ROI_PREFERENCE';

export const LOAD_VIEW_STATE = 'LOAD_VIEW_STATE';
