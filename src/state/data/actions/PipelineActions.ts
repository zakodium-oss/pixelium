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

export type MovePipelineOperationUpAction = DataActionType<
  'MOVE_PIPELINE_OPERATION_UP',
  { identifier: string; opIdentifier: string }
>;

export type MovePipelineOperationDownAction = DataActionType<
  'MOVE_PIPELINE_OPERATION_DOWN',
  { identifier: string; opIdentifier: string }
>;

export function addGreyFilter(
  draft: Draft<DataState>,
  { identifier, options }: { identifier: string; options: GreyOptions },
) {
  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);

  const { pipeline, image } = dataFile;

  // eslint-disable-next-line unicorn/no-array-reduce
  const biggestOrder = pipeline.reduce(
    (acc, operation) => Math.max(acc, operation.order),
    0,
  );
  pipeline.push({
    identifier: uuid(),
    type: 'GREY_FILTER',
    order: biggestOrder + 1,
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

  // eslint-disable-next-line unicorn/no-array-reduce
  const biggestOrder = pipeline.reduce(
    (acc, operation) => Math.max(acc, operation.order),
    0,
  );
  pipeline.push({
    identifier: uuid(),
    type: 'BLUR',
    order: biggestOrder + 1,
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

  // eslint-disable-next-line unicorn/no-array-reduce
  const biggestOrder = pipeline.reduce(
    (acc, operation) => Math.max(acc, operation.order),
    0,
  );
  pipeline.push({
    identifier: uuid(),
    type: 'MASK',
    order: biggestOrder + 1,
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

export function moveOperationUp(
  draft: Draft<DataState>,
  { identifier, opIdentifier }: { identifier: string; opIdentifier: string },
) {
  moveOperation(draft, identifier, opIdentifier, 'UP');
}

export function moveOperationDown(
  draft: Draft<DataState>,
  { identifier, opIdentifier }: { identifier: string; opIdentifier: string },
) {
  moveOperation(draft, identifier, opIdentifier, 'DOWN');
}

export function moveOperation(
  draft: Draft<DataState>,
  identifier: string,
  opIdentifier: string,
  direction: 'UP' | 'DOWN',
) {
  const factor = direction === 'UP' ? -1 : 1;

  const dataFile = draft.images[identifier];
  if (dataFile === undefined) throw new Error(`Image ${identifier} not found`);
  const { pipeline } = dataFile;

  const operationIndex = pipeline.findIndex(
    (operation) => operation.identifier === opIdentifier,
  );
  if (operationIndex === -1) {
    throw new Error(`Operation ${opIdentifier} not found`);
  }

  const upperOperationIndex = pipeline.findIndex(
    (maybeUpperOperation) =>
      maybeUpperOperation.order === pipeline[operationIndex].order + factor,
  );
  if (upperOperationIndex === -1) {
    throw new Error(`Operation ${opIdentifier} has no upper operation`);
  }

  pipeline[operationIndex].order += factor;
  pipeline[upperOperationIndex].order -= factor;

  pipeline.sort((a, b) => a.order - b.order);
}

function runPipeline(
  pipeline: Draft<PipelineOperations>[],
  baseImage: Draft<Image>,
) {
  for (const [index, operation] of pipeline.entries()) {
    if (!operation.isActive) {
      continue;
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
