import { v4 as uuid } from '@lukeed/uuid';
import { GreyOptions, Image } from 'image-js';
import { Draft } from 'immer';

import { DataActionType } from '../DataActionTypes';
import { DataState, PipelineOperations } from '../DataReducer';

export type PipelineAddGreyFilterAction = DataActionType<
  'ADD_GREY_FILTER',
  { identifier: string; options: GreyOptions }
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
  let previous = baseImage;
  for (const operation of pipeline) {
    if (!operation.isActive) {
      continue;
    }

    switch (operation.type) {
      case 'GREY_FILTER':
        operation.result = previous.grey({
          algorithm: operation.options.algorithm,
        });
        previous = operation.result;
        break;
      default:
        throw new Error(`Unknown operation type ${operation.type}`);
    }
  }
}
