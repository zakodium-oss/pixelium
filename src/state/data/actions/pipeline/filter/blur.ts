import { v4 as uuid } from '@lukeed/uuid';
import { BlurOptions } from 'image-js';
import { Draft } from 'immer';

import { DataActionType } from '../../../DataActionTypes';
import { DataState } from '../../../DataReducer';

export const SET_BLUR = 'SET_BLUR';

export type PipelineAddBlurAction = DataActionType<
  typeof SET_BLUR,
  { identifier: string; opIdentifier?: string; options: BlurOptions }
>;

export function addBlur(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: PipelineAddBlurAction['payload'],
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
