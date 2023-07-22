import { Draft, produce } from 'immer';
import { Reducer } from 'react';

import { PipelineOperations } from '../data/actions/pipeline/PipelineOperations';

import * as Type from './ViewActionTypes';
import { SetPanZoomAction } from './actions/ImageViewerActions';
import * as ImageViewerActions from './actions/ImageViewerActions';
import * as LoadActions from './actions/LoadActions';
import { LoadViewStateAction } from './actions/LoadActions';
import { SetEditROIPreferenceAction } from './actions/MiscActions';
import * as MiscActions from './actions/MiscActions';
import * as ModalActions from './actions/ModalActions';
import {
  CloseModalAction,
  OpenModalAction,
  SetEditModeIdentifierAction,
} from './actions/ModalActions';
import * as TabActions from './actions/TabActions';
import { CloseTabAction, OpenTabAction } from './actions/TabActions';

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
  ERODE: 'erode',
  OPEN: 'open',
  CLOSE: 'close',
  RESIZE: 'resize',
  ROTATE: 'rotate',
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
  | 'dilate'
  | 'erode'
  | 'open'
  | 'close'
  | 'resize'
  | 'rotate'
  | 'extractROI';

export interface ViewState {
  currentTab: string | undefined;
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
  editROIPreference: boolean;
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
    erode: false,
    open: false,
    close: false,
    resize: false,
    rotate: false,
    extractROI: false,
  },
  editMode: null,
  editROIPreference: false,
};

export type ViewActions =
  | OpenTabAction
  | CloseTabAction
  | SetPanZoomAction
  | OpenModalAction
  | CloseModalAction
  | SetEditModeIdentifierAction
  | SetEditROIPreferenceAction
  | LoadViewStateAction;

function innerViewReducer(draft: Draft<ViewState>, action: ViewActions) {
  switch (action.type) {
    case Type.LOAD_VIEW_STATE:
      return LoadActions.loadViewState(draft, action.payload);
    case Type.OPEN_TAB:
      return TabActions.openTab(draft, action.payload);
    case Type.CLOSE_TAB:
      return TabActions.closeTab(draft);
    case Type.SET_PAN_ZOOM:
      return ImageViewerActions.setPanZoom(draft, action.payload);
    case Type.OPEN_MODAL:
      return ModalActions.openModal(draft, action.payload);
    case Type.CLOSE_MODAL:
      return ModalActions.closeModal(draft, action.payload);
    case Type.SET_EDIT_MODE_IDENTIFIER:
      return ModalActions.setEditModeIdentifier(draft, action.payload);
    case Type.SET_EDIT_ROI_PREFERENCE:
      return MiscActions.setEditROIPreference(draft, action.payload);
    default:
      throw new Error('Unknown action type in view reducer.');
  }
}

export const viewReducer: Reducer<ViewState, ViewActions> =
  produce(innerViewReducer);
