import { v4 as uuid } from '@lukeed/uuid';
import {
  BlurOptions,
  GreyOptions,
  Image,
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

    if (operation.type === 'GREY_FILTER') {
      if (applyOn instanceof Image) {
        operation.result = applyOn.grey({
          algorithm: operation.options.algorithm,
        });
      }
    } else if (operation.type === 'BLUR') {
      if (applyOn instanceof Image) {
        operation.result = applyOn.blur({
          width: operation.options.width,
          height: operation.options.height,
          borderType: operation.options.borderType,
          borderValue: operation.options.borderValue,
        });
      }
    } else if (operation.type === 'MASK') {
      if (applyOn instanceof Image) {
        operation.result = applyOn.threshold({
          algorithm: operation.options.algorithm,
        });
      }
    } else {
      throw new Error('Unknown operation type');
    }
  }
}
