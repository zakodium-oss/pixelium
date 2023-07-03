import { Draft, produce } from 'immer';
import { Reducer } from 'react';

import { PipelineOperations } from '../data/DataReducer';

import * as Type from './ViewActionTypes';
import { SetPanZoomAction } from './actions/ImageViewerActions';
import * as ImageViewerActions from './actions/ImageViewerActions';
import * as ModalActions from './actions/ModalActions';
import {
  CloseModalAction,
  OpenModalAction,
  SetEditModeIdentifierAction,
} from './actions/ModalActions';
import * as TabActions from './actions/TabActions';
import { OpenTabAction } from './actions/TabActions';

export const OP_TYPE_MODAL_MAP: {
  [key in PipelineOperations['type']]: ModalName;
} = {
  GREY_FILTER: 'grey',
  BLUR: 'blur',
  GAUSSIAN_BLUR: 'gaussianBlur',
  INVERT: 'invert',
  FLIP: 'flip',
  LEVEL: 'level',
  PIXELATE: 'pixelate',
  MASK: 'mask',
  MEDIAN_FILTER: 'median',
  DILATE: 'dilate',
};

export function getModalNameFromOperationType(
  type: PipelineOperations['type'],
): ModalName {
  return OP_TYPE_MODAL_MAP[type];
}

export type ModalName =
  | 'grey'
  | 'blur'
  | 'gaussianBlur'
  | 'invert'
  | 'flip'
  | 'level'
  | 'pixelate'
  | 'mask'
  | 'log'
  | 'about'
  | 'export'
  | 'median'
  | 'dilate';

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
  editMode: { identifier: string; opIdentifier: string } | null;
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
    about: false,
    export: false,
    median: false,
    dilate: false,
  },
  editMode: null,
};

export type ViewActions =
  | OpenTabAction
  | SetPanZoomAction
  | OpenModalAction
  | CloseModalAction
  | SetEditModeIdentifierAction;

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
    case Type.SET_EDIT_MODE_IDENTIFIER:
      return ModalActions.setEditModeIdentifier(draft, action.payload);
    default:
      throw new Error('Unknown action type in view reducer.');
  }
}

export const viewReducer: Reducer<ViewState, ViewActions> =
  produce(innerViewReducer);
