import { useContext, useMemo } from 'react';

import { PipelineContext } from '../components/context/PipelineContext';

export default function useImage(toOperation?: string) {
  const pipelineContent = useContext(PipelineContext);

  return useMemo(
    () => ({
      original: pipelineContent.original,
      pipelined: pipelineContent.pipelined(toOperation),
    }),
    [pipelineContent, toOperation],
  );
}
