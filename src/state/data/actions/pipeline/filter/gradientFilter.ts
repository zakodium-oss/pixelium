import { v4 as uuid } from '@lukeed/uuid';
import { GradientFilterXYOptions } from 'image-js';
import { Draft } from 'immer';

import { ExtractOperation } from '../../../../../types/ExtractOperation';
import { DataActionType } from '../../../DataActionTypes';
import { DataState } from '../../../DataReducer';

export const SET_GRADIENT_FILTER = 'SET_GRADIENT_FILTER';

export type PipelineSetGradientFilterAction = DataActionType<
  typeof SET_GRADIENT_FILTER,
  {
    identifier: string;
    opIdentifier?: string;
    options: GradientFilterXYOptions;
  }
>;

export type GradientFilterOperation =
  ExtractOperation<PipelineSetGradientFilterAction>;

export function setGradientFilter(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: PipelineSetGradientFilterAction['payload'],
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
      type: 'GRADIENT_FILTER',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'GRADIENT_FILTER',
      isActive: true,
      options,
    };
  }
}
