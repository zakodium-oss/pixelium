import { DataActionType } from '../state/data/DataActionTypes';
import { PipelineOperation } from '../state/data/actions/pipeline/PipelineOperations';

import { RemoveSetPrefix } from './RemoveSetPrefix';

export type ExtractOperation<D extends DataActionType<string, unknown>> =
  D extends {
    payload: { options: infer Options };
  }
    ? PipelineOperation<RemoveSetPrefix<D['type']>, Options>
    : PipelineOperation<RemoveSetPrefix<D['type']>, undefined>;
