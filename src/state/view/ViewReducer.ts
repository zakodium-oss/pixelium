import { Draft, produce } from 'immer';
import { Reducer } from 'react';

import * as Type from './ViewActionTypes';
import { SetPanZoomAction } from './actions/ImageViewerActions';
import * as ImageViewerActions from './actions/ImageViewerActions';
import * as ModalActions from './actions/ModalActions';
import { CloseModalAction, OpenModalAction } from './actions/ModalActions';
import * as TabActions from './actions/TabActions';
import { OpenTabAction } from './actions/TabActions';

export type ModalName =
  | 'grey'
  | 'blur'
  | 'gaussianBlur'
  | 'invert'
  | 'flip'
  | 'level'
  | 'pixelate'
  | 'mask'
  | 'log';

export interface ViewState {
  currentTab?: string;
  imageViewerProps: Record<
    string,
    {
      translation: {
        x: number;
        y: number;
      };
      scale: number;
    }
  >;
  modals: Record<ModalName, boolean>;
}

export const initialViewState: ViewState = {
  currentTab: undefined,
  imageViewerProps: {},
  modals: {
    grey: false,
    blur: false,
    gaussianBlur: false,
    invert: false,
    flip: false,
    level: false,
    pixelate: false,
    mask: false,
    log: false,
  },
};

export type ViewActions =
  | OpenTabAction
  | SetPanZoomAction
  | OpenModalAction
  | CloseModalAction;

function innerViewReducer(draft: Draft<ViewState>, action: ViewActions) {
  switch (action.type) {
    case Type.OPEN_TAB:
      return TabActions.openTab(draft, action.payload);
    case Type.SET_PAN_ZOOM:
      return ImageViewerActions.setPanZoom(draft, action.payload);
    case Type.OPEN_MODAL:
      return ModalActions.openModal(draft, action.payload);
    case Type.CLOSE_MODAL:
      return ModalActions.closeModal(draft, action.payload);
    default:
      throw new Error('Unknown action type in view reducer.');
  }
}

export const viewReducer: Reducer<any, any> = produce(innerViewReducer);
