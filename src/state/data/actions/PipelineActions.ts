import { v4 as uuid } from '@lukeed/uuid';
import {
  BlurOptions,
  FlipOptions,
  GaussianBlurXYOptions,
  GreyOptions,
  Image,
  LevelOptions,
  PixelateOptions,
  ThresholdOptionsAlgorithm,
} from 'image-js';
import { Draft } from 'immer';

import { DataActionType } from '../DataActionTypes';
import { DataState, PipelineOperations } from '../DataReducer';

export type PipelineAddGreyFilterAction = DataActionType<
  'ADD_GREY_FILTER',
  { identifier: string; options: GreyOptions }
>;

export type PipelineAddBlurAction = DataActionType<
  'ADD_BLUR',
  { identifier: string; options: BlurOptions }
>;

export type PipelineAddGaussianBlurAction = DataActionType<
  'ADD_GAUSSIAN_BLUR',
  { identifier: string; options: GaussianBlurXYOptions }
>;

export type PipelineAddInvertAction = DataActionType<
  'ADD_INVERT',
  { identifier: string }
>;

export type PipelineAddFlipAction = DataActionType<
  'ADD_FLIP',
  { identifier: string; options: FlipOptions }
>;

export type PipelineAddLevelAction = DataActionType<
  'ADD_LEVEL',
  { identifier: string; options: LevelOptions }
>;

export type PipelineAddPixelateAction = DataActionType<
  'ADD_PIXELATE',
  { identifier: string; options: PixelateOptions }
>;

export type PipelineAddMaskAction = DataActionType<
  'ADD_MASK',
  { identifier: string; options: ThresholdOptionsAlgorithm }
>;

export type RemovePipelineOperationAction = DataActionType<
  'REMOVE_PIPELINE_OPERATION',
  { identifier: string; opIdentifier: string }
>;

export type TogglePipelineOperationAction = DataActionType<
  'TOGGLE_PIPELINE_OPERATION',
  { identifier: string; opIdentifier: string; checked: boolean }
>;

export function addGreyFilter(
  draft: Draft<DataState>,
  { identifier, options }: { identifier: string; options: GreyOptions },
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline, image } = dataFile;

  pipeline.push({
    identifier: uuid(),
    type: 'GREY_FILTER',
    isActive: true,
    options,
  });

  runPipeline(pipeline, image);
}

export function addBlur(
  draft: Draft<DataState>,
  { identifier, options }: { identifier: string; options: BlurOptions },
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline, image } = dataFile;

  pipeline.push({
    identifier: uuid(),
    type: 'BLUR',
    isActive: true,
    options,
  });

  runPipeline(pipeline, image);
}

export function addGaussianBlur(
  draft: Draft<DataState>,
  {
    identifier,
    options,
  }: { identifier: string; options: GaussianBlurXYOptions },
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline, image } = dataFile;

  pipeline.push({
    identifier: uuid(),
    type: 'GAUSSIAN_BLUR',
    isActive: true,
    options,
  });

  runPipeline(pipeline, image);
}

export function addInvert(
  draft: Draft<DataState>,
  { identifier }: { identifier: string },
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline, image } = dataFile;

  pipeline.push({
    identifier: uuid(),
    type: 'INVERT',
    isActive: true,
  });

  runPipeline(pipeline, image);
}

export function addFlip(
  draft: Draft<DataState>,
  { identifier, options }: { identifier: string; options: FlipOptions },
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline, image } = dataFile;

  pipeline.push({
    identifier: uuid(),
    type: 'FLIP',
    isActive: true,
    options,
  });

  runPipeline(pipeline, image);
}

export function addPixelate(
  draft: Draft<DataState>,
  { identifier, options }: { identifier: string; options: PixelateOptions },
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline, image } = dataFile;

  pipeline.push({
    identifier: uuid(),
    type: 'PIXELATE',
    isActive: true,
    options,
  });

  runPipeline(pipeline, image);
}

export function addLevel(
  draft: Draft<DataState>,
  { identifier, options }: { identifier: string; options: LevelOptions },
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline, image } = dataFile;

  pipeline.push({
    identifier: uuid(),
    type: 'LEVEL',
    isActive: true,
    options,
  });

  runPipeline(pipeline, image);
}

export function addMask(
  draft: Draft<DataState>,
  {
    identifier,
    options,
  }: { identifier: string; options: ThresholdOptionsAlgorithm },
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline, image } = dataFile;

  pipeline.push({
    identifier: uuid(),
    type: 'MASK',
    isActive: true,
    options,
  });

  runPipeline(pipeline, image);
}

export function removeOperation(
  draft: Draft<DataState>,
  { identifier, opIdentifier }: { identifier: string; opIdentifier: string },
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline, image } = dataFile;

  const indexToRemove = pipeline.findIndex(
    (operation) => operation.identifier === opIdentifier,
  );
  if (indexToRemove === -1) {
    throw new Error(`Operation ${opIdentifier} not found`);
  }

  pipeline.splice(indexToRemove, 1);

  runPipeline(pipeline, image);
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

  const { pipeline, image } = dataFile;

  const selectedIndex = pipeline.findIndex(
    (operation) => operation.identifier === opIdentifier,
  );

  for (const [index, operation] of pipeline.entries()) {
    operation.isActive = checked
      ? index <= selectedIndex
      : index < selectedIndex;
  }

  runPipeline(pipeline, image);
}

function runPipeline(
  pipeline: Draft<PipelineOperations>[],
  baseImage: Draft<Image>,
) {
  for (const [index, operation] of pipeline.entries()) {
    if (!operation.isActive) {
      break;
    }

    const applyOn = index === 0 ? baseImage : pipeline[index - 1].result;
    if (applyOn === undefined) break;

    switch (operation.type) {
      case 'GREY_FILTER': {
        if (applyOn instanceof Image) {
          operation.result = applyOn.grey({
            algorithm: operation.options.algorithm,
          });
        }
        break;
      }
      case 'BLUR': {
        if (applyOn instanceof Image) {
          operation.result = applyOn.blur({
            width: operation.options.width,
            height: operation.options.height,
            borderType: operation.options.borderType,
            borderValue: operation.options.borderValue,
          });
        }
        break;
      }
      case 'MASK': {
        if (applyOn instanceof Image) {
          operation.result = applyOn.threshold({
            algorithm: operation.options.algorithm,
          });
        }
        break;
      }
      case 'GAUSSIAN_BLUR': {
        if (applyOn instanceof Image) {
          operation.result = applyOn.gaussianBlur({
            sigmaX: operation.options.sigmaX,
            sigmaY: operation.options.sigmaY,
            sizeX: operation.options.sizeX,
            sizeY: operation.options.sizeY,
          });
        }
        break;
      }
      case 'INVERT': {
        operation.result = applyOn.invert();
        break;
      }
      case 'FLIP': {
        if (applyOn instanceof Image) {
          operation.result = applyOn.flip({
            axis: operation.options.axis,
          });
        }
        break;
      }
      case 'LEVEL': {
        if (applyOn instanceof Image) {
          operation.result = applyOn.level({
            channels: operation.options.channels,
            inputMin: operation.options.inputMin,
            inputMax: operation.options.inputMax,
            outputMin: operation.options.outputMin,
            outputMax: operation.options.outputMax,
            gamma: operation.options.gamma,
          });
        }
        break;
      }
      case 'PIXELATE': {
        if (applyOn instanceof Image) {
          operation.result = applyOn.pixelate({
            cellSize: operation.options.cellSize,
            algorithm: operation.options.algorithm,
          });
        }
        break;
      }
      default:
        throw new Error(`Unknown operation`);
    }
  }
}
