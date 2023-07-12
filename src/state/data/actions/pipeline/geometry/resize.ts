import { v4 as uuid } from '@lukeed/uuid';
import { ResizeOptions } from 'image-js';
import { Draft } from 'immer';

import { ExtractOperation } from '../../../../../types/ExtractOperation';
import { DataActionType } from '../../../DataActionTypes';
import { DataState } from '../../../DataReducer';

export const SET_RESIZE = 'SET_RESIZE';

export type PipelineSetResizeAction = DataActionType<
  typeof SET_RESIZE,
  { identifier: string; opIdentifier?: string; options: ResizeOptions }
>;

export type ResizeOperation = ExtractOperation<PipelineSetResizeAction>;

export function setResize(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: PipelineSetResizeAction['payload'],
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
      type: 'RESIZE',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'RESIZE',
      isActive: true,
      options,
    };
  }
}
