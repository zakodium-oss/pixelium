import { v4 as uuid } from '@lukeed/uuid';
import { ImageColorModel } from 'image-js';
import { Draft } from 'immer';

import { ExtractOperation } from '../../../../../types/ExtractOperation';
import { DataActionType } from '../../../DataActionTypes';
import { DataState } from '../../../DataReducer';

export const SET_CONVERT_COLOR = 'SET_CONVERT_COLOR';

export type ConvertColorOptions = { colorModel: ImageColorModel };

export type PipelineSetConvertColorAction = DataActionType<
  typeof SET_CONVERT_COLOR,
  { identifier: string; opIdentifier?: string; options: ConvertColorOptions }
>;

export type ConvertColorOperation =
  ExtractOperation<PipelineSetConvertColorAction>;

export function setConvertColor(
  draft: Draft<DataState>,
  {
    identifier,
    opIdentifier = uuid(),
    options,
  }: PipelineSetConvertColorAction['payload'],
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
      type: 'CONVERT_COLOR',
      isActive: true,
      options,
    });
  } else {
    pipeline[existingIndex] = {
      identifier: opIdentifier,
      type: 'CONVERT_COLOR',
      isActive: true,
      options,
    };
  }
}
