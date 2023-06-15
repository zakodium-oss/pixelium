import { v4 as uuid } from '@lukeed/uuid';
import { GreyOptions } from 'image-js';
import { Draft } from 'immer';

import { DataActionType } from '../DataActionTypes';
import { DataState } from '../DataReducer';

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
  const { pipeline } = draft.images[identifier];
  const biggestOrder = pipeline.reduce(
    (acc, operation) => Math.max(acc, operation.order),
    0,
  );
  pipeline.push({
    identifier: uuid(),
    type: 'GREY_FILTER',
    order: biggestOrder + 1,
    options,
  });
}

export function removePipelineOperation(
  draft: Draft<DataState>,
  { identifier, opIdentifier }: { identifier: string; opIdentifier: string },
) {
  draft.images[identifier].pipeline = draft.images[identifier].pipeline
    .filter((operation) => operation.identifier !== opIdentifier)
    .sort((a, b) => a.order - b.order);
}

export function movePipelineOperationUp(
  draft: Draft<DataState>,
  { identifier, opIdentifier }: { identifier: string; opIdentifier: string },
) {
  movePipelineOperation(draft, identifier, opIdentifier, 'UP');
}

export function movePipelineOperationDown(
  draft: Draft<DataState>,
  { identifier, opIdentifier }: { identifier: string; opIdentifier: string },
) {
  movePipelineOperation(draft, identifier, opIdentifier, 'DOWN');
}

function movePipelineOperation(
  draft: Draft<DataState>,
  identifier: string,
  opIdentifier: string,
  direction: 'UP' | 'DOWN',
) {
  const factor = direction === 'UP' ? -1 : 1;

  const operationIndex = draft.images[identifier].pipeline.findIndex(
    (operation) => operation.identifier === opIdentifier,
  );
  if (operationIndex === -1) {
    throw new Error(`Operation ${opIdentifier} not found`);
  }

  const upperOperationIndex = draft.images[identifier].pipeline.findIndex(
    (maybeUpperOperation) =>
      maybeUpperOperation.order ===
      draft.images[identifier].pipeline[operationIndex].order + factor,
  );
  if (upperOperationIndex === -1) {
    throw new Error(`Operation ${identifier} has no upper operation`);
  }

  draft.images[identifier].pipeline[operationIndex].order += factor;
  draft.images[identifier].pipeline[upperOperationIndex].order -= factor;

  draft.images[identifier].pipeline = draft.images[identifier].pipeline.sort(
    (a, b) => a.order - b.order,
  );
}
