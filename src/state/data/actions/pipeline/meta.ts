import { Draft } from 'immer';

import { DataActionType } from '../../DataActionTypes';
import { DataState } from '../../DataReducer';

export const REMOVE_PIPELINE_OPERATION = 'REMOVE_PIPELINE_OPERATION';
export const TOGGLE_PIPELINE_OPERATION = 'TOGGLE_PIPELINE_OPERATION';

export type RemovePipelineOperationAction = DataActionType<
  typeof REMOVE_PIPELINE_OPERATION,
  { identifier: string; opIdentifier: string }
>;

export type TogglePipelineOperationAction = DataActionType<
  typeof TOGGLE_PIPELINE_OPERATION,
  { identifier: string; opIdentifier: string; checked: boolean }
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
