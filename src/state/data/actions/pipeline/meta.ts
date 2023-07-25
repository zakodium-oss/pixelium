import { v4 as uuid } from '@lukeed/uuid';
import { Draft } from 'immer';

import { DataActionType } from '../../DataActionTypes';
import { DataState } from '../../DataReducer';

export const REMOVE_OPERATION = 'REMOVE_OPERATION';
export const TOGGLE_OPERATION = 'TOGGLE_OPERATION';

export const COPY_OPERATIONS = 'COPY_OPERATIONS';

export type RemovePipelineOperationAction = DataActionType<
  typeof REMOVE_OPERATION,
  { identifier: string; opIdentifier: string }
>;

export type TogglePipelineOperationAction = DataActionType<
  typeof TOGGLE_OPERATION,
  { identifier: string; opIdentifier: string; checked: boolean }
>;

export type CopyPipelineOperationsAction = DataActionType<
  typeof COPY_OPERATIONS,
  { fromIdentifier: string; toIdentifier: string }
>;

export function removeOperation(
  draft: Draft<DataState>,
  { identifier, opIdentifier }: RemovePipelineOperationAction['payload'],
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
  }: TogglePipelineOperationAction['payload'],
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

export function copyOperations(
  draft: Draft<DataState>,
  { fromIdentifier, toIdentifier }: CopyPipelineOperationsAction['payload'],
) {
  const dataFile = draft.images[fromIdentifier];
  if (dataFile === undefined) {
    throw new Error(`Image ${fromIdentifier} not found`);
  }

  const { pipeline } = dataFile;

  const newPipeline = pipeline.map((operation) => ({
    ...operation,
    identifier: uuid(),
  }));

  draft.images[toIdentifier].pipeline.push(...newPipeline);
}
