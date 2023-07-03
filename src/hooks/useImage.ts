import { useContext } from 'react';

import { PipelineContext } from '../components/context/PipelineContext';

export default function useImage(toOperation?: string) {
  const pipelineContent = useContext(PipelineContext);

  const toReturn = {
    original: pipelineContent.original,
    pipelined: pipelineContent.pipelined(toOperation),
  };

  return toReturn;
}
