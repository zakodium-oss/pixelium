export type ViewActionType<Action, Payload = void> = Payload extends void
  ? { type: Action }
  : { type: Action; payload: Payload };

export const OPEN_TAB = 'OPEN_TAB';
export const SET_PAN_ZOOM = 'SET_PAN_ZOOM';
