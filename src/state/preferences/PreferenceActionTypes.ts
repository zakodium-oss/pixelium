export type PreferenceActionType<Action, Payload = void> = Payload extends void
  ? { type: Action }
  : { type: Action; payload: Payload };

export const INITIALIZE_PREFERENCES = 'INITIALIZE_PREFERENCES';