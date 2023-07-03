import { v4 as uuid } from '@lukeed/uuid';
import {
  BlurOptions,
  CloseOptions,
  DilateOptions,
  ErodeOptions,
  FlipOptions,
  GaussianBlurXYOptions,
  GreyOptions,
  LevelOptions,
  MedianFilterOptions,
  OpenOptions,
  PixelateOptions,
  ThresholdOptionsAlgorithm,
} from 'image-js';
import { Draft } from 'immer';

import {
  DataActionType,
  REMOVE_PIPELINE_OPERATION,
  SET_BLUR,
  SET_CLOSE,
  SET_DILATE,
  SET_ERODE,
  SET_FLIP,
  SET_GAUSSIAN_BLUR,
  SET_GREY_FILTER,
  SET_INVERT,
  SET_LEVEL,
  SET_MASK,
  SET_MEDIAN_FILTER,
  SET_OPEN,
  SET_PIXELATE,
  TOGGLE_PIPELINE_OPERATION,
} from '../DataActionTypes';
import { DataState } from '../DataReducer';

export type PipelineAddGreyFilterAction = DataActionType<
  typeof SET_GREY_FILTER,
  { identifier: string; opIdentifier?: string; options: GreyOptions }
>;

export type PipelineAddBlurAction = DataActionType<
  typeof SET_BLUR,
  { identifier: string; opIdentifier?: string; options: BlurOptions }
>;

export type PipelineAddGaussianBlurAction = DataActionType<
  typeof SET_GAUSSIAN_BLUR,
  { identifier: string; opIdentifier?: string; options: GaussianBlurXYOptions }
>;

export type PipelineAddInvertAction = DataActionType<
  typeof SET_INVERT,
  { identifier: string; opIdentifier?: string }
>;

export type PipelineAddFlipAction = DataActionType<
  typeof SET_FLIP,
  { identifier: string; opIdentifier?: string; options: FlipOptions }
>;

export type PipelineAddLevelAction = DataActionType<
  typeof SET_LEVEL,
  { identifier: string; opIdentifier?: string; options: LevelOptions }
>;

export type PipelineAddPixelateAction = DataActionType<
  typeof SET_PIXELATE,
  { identifier: string; opIdentifier?: string; options: PixelateOptions }
>;

export type PipelineAddMedianFilterAction = DataActionType<
  typeof SET_MEDIAN_FILTER,
  { identifier: string; opIdentifier?: string; options: MedianFilterOptions }
>;

export type PipelineAddMaskAction = DataActionType<
  typeof SET_MASK,
  {
    identifier: string;
    opIdentifier?: string;
    options: ThresholdOptionsAlgorithm;
  }
>;

export type PipelineAddDilateAction = DataActionType<
  typeof SET_DILATE,
  { identifier: string; opIdentifier?: string; options: DilateOptions }
>;

export type PipelineAddErodeAction = DataActionType<
  typeof SET_ERODE,
  { identifier: string; opIdentifier?: string; options: ErodeOptions }
>;

export type PipelineAddOpenAction = DataActionType<
  typeof SET_OPEN,
  { identifier: string; opIdentifier?: string; options: OpenOptions }
>;

export type PipelineAddCloseAction = DataActionType<
  typeof SET_CLOSE,
  { identifier: string; opIdentifier?: string; options: CloseOptions }
>;

export type RemovePipelineOperationAction = DataActionType<
  typeof REMOVE_PIPELINE_OPERATION,
  { identifier: string; opIdentifier: string }
>;

export type TogglePipelineOperationAction = DataActionType<
  typeof TOGGLE_PIPELINE_OPERATION,
  { identifier: string; opIdentifier: string; checked: boolean }
>;

export function addGreyFilter(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: { identifier: string; opIdentifier?: string; options: GreyOptions },
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline } = dataFile;

  const existingIndex = pipeline.findIndex(
    (operation) => operation.identifier === opIdentifier,
  );

  if (existingIndex === -1) {
    pipeline.push({
      identifier: uuid(),
      type: 'GREY_FILTER',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'GREY_FILTER',
      isActive: true,
      options,
    };
  }
}

export function addBlur(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: { identifier: string; opIdentifier?: string; options: BlurOptions },
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline } = dataFile;

  const existingIndex = pipeline.findIndex(
    (operation) => operation.identifier === opIdentifier,
  );

  if (existingIndex === -1) {
    pipeline.push({
      identifier: opIdentifier,
      type: 'BLUR',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'BLUR',
      isActive: true,
      options,
    };
  }
}

export function addGaussianBlur(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: {
    identifier: string;
    opIdentifier?: string;
    options: GaussianBlurXYOptions;
  },
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline } = dataFile;

  const existingIndex = pipeline.findIndex(
    (operation) => operation.identifier === opIdentifier,
  );

  if (existingIndex === -1) {
    pipeline.push({
      identifier: uuid(),
      type: 'GAUSSIAN_BLUR',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'GAUSSIAN_BLUR',
      isActive: true,
      options,
    };
  }
}

export function addInvert(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
  }: { identifier: string; opIdentifier?: string },
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline } = dataFile;

  const existingIndex = pipeline.findIndex(
    (operation) => operation.identifier === opIdentifier,
  );

  if (existingIndex === -1) {
    pipeline.push({
      identifier: uuid(),
      type: 'INVERT',
      isActive: true,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'INVERT',
      isActive: true,
    };
  }
}

export function addFlip(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: { identifier: string; opIdentifier?: string; options: FlipOptions },
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline } = dataFile;

  const existingIndex = pipeline.findIndex(
    (operation) => operation.identifier === opIdentifier,
  );

  if (existingIndex === -1) {
    pipeline.push({
      identifier: uuid(),
      type: 'FLIP',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'FLIP',
      isActive: true,
      options,
    };
  }
}

export function addLevel(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: { identifier: string; opIdentifier?: string; options: LevelOptions },
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline } = dataFile;

  const existingIndex = pipeline.findIndex(
    (operation) => operation.identifier === opIdentifier,
  );

  if (existingIndex === -1) {
    pipeline.push({
      identifier: uuid(),
      type: 'LEVEL',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'LEVEL',
      isActive: true,
      options,
    };
  }
}

export function addPixelate(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: { identifier: string; opIdentifier?: string; options: PixelateOptions },
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline } = dataFile;

  const existingIndex = pipeline.findIndex(
    (operation) => operation.identifier === opIdentifier,
  );

  if (existingIndex === -1) {
    pipeline.push({
      identifier: uuid(),
      type: 'PIXELATE',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'PIXELATE',
      isActive: true,
      options,
    };
  }
}

export function addMedianFilter(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: {
    identifier: string;
    opIdentifier?: string;
    options: MedianFilterOptions;
  },
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline } = dataFile;

  const existingIndex = pipeline.findIndex(
    (operation) => operation.identifier === opIdentifier,
  );

  if (existingIndex === -1) {
    pipeline.push({
      identifier: uuid(),
      type: 'MEDIAN_FILTER',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'MEDIAN_FILTER',
      isActive: true,
      options,
    };
  }
}

export function addMask(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: {
    identifier: string;
    opIdentifier?: string;
    options: ThresholdOptionsAlgorithm;
  },
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline } = dataFile;

  const existingIndex = pipeline.findIndex(
    (operation) => operation.identifier === opIdentifier,
  );

  if (existingIndex === -1) {
    pipeline.push({
      identifier: uuid(),
      type: 'MASK',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'MASK',
      isActive: true,
      options,
    };
  }
}

export function addDilate(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: { identifier: string; opIdentifier?: string; options: DilateOptions },
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline } = dataFile;

  const existingIndex = pipeline.findIndex(
    (operation) => operation.identifier === opIdentifier,
  );

  if (existingIndex === -1) {
    pipeline.push({
      identifier: uuid(),
      type: 'DILATE',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'DILATE',
      isActive: true,
      options,
    };
  }
}

export function addErode(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: { identifier: string; opIdentifier?: string; options: ErodeOptions },
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline } = dataFile;

  const existingIndex = pipeline.findIndex(
    (operation) => operation.identifier === opIdentifier,
  );

  if (existingIndex === -1) {
    pipeline.push({
      identifier: uuid(),
      type: 'ERODE',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'ERODE',
      isActive: true,
      options,
    };
  }
}

export function addOpen(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: { identifier: string; opIdentifier?: string; options: OpenOptions },
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline } = dataFile;

  const existingIndex = pipeline.findIndex(
    (operation) => operation.identifier === opIdentifier,
  );

  if (existingIndex === -1) {
    pipeline.push({
      identifier: uuid(),
      type: 'OPEN',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'OPEN',
      isActive: true,
      options,
    };
  }
}

export function addClose(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: { identifier: string; opIdentifier?: string; options: CloseOptions },
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline } = dataFile;

  const existingIndex = pipeline.findIndex(
    (operation) => operation.identifier === opIdentifier,
  );

  if (existingIndex === -1) {
    pipeline.push({
      identifier: uuid(),
      type: 'CLOSE',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'CLOSE',
      isActive: true,
      options,
    };
  }
}

export function removeOperation(
  draft: Draft<DataState>,
  { identifier, opIdentifier }: { identifier: string; opIdentifier: string },
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline } = dataFile;

  const indexToRemove = pipeline.findIndex(
    (operation) => operation.identifier === opIdentifier,
  );
  if (indexToRemove === -1) {
    throw new Error(`Operation ${opIdentifier} not found`);
  }

  pipeline.splice(indexToRemove, 1);
}

export function toggleOperation(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier,
    checked,
  }: { identifier: string; opIdentifier: string; checked: boolean },
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline } = dataFile;

  const selectedIndex = pipeline.findIndex(
    (operation) => operation.identifier === opIdentifier,
  );

  for (const [index, operation] of pipeline.entries()) {
    operation.isActive = checked
      ? index <= selectedIndex
      : index < selectedIndex;
  }
}
