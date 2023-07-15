import { Image, Mask } from 'image-js';
import { createContext, ReactNode, useCallback, useMemo } from 'react';

import useData from '../../hooks/useData';
import useLog from '../../hooks/useLog';
import { EMPTY_IMAGE } from '../../utils/defaults';
import runPipeline from '../../utils/runPipeline';

interface PipelineContextContent {
  pipelined: (toOperation?: string) => Image | Mask;
  original: Image;
}

export const PipelineContext = createContext<PipelineContextContent>({
  pipelined: () => EMPTY_IMAGE,
  original: EMPTY_IMAGE,
});

interface PipelineProviderProps {
  identifier: string | undefined;
  children: ReactNode;
}

const defaultEmptyArray = [];

export function PipelineProvider({
  identifier,
  children,
}: PipelineProviderProps) {
  const { images } = useData();

  const dataFile = useMemo(
    () =>
      identifier === undefined || images[identifier] === undefined
        ? { pipeline: defaultEmptyArray, image: EMPTY_IMAGE }
        : images[identifier],
    [identifier, images],
  );

  const { logger } = useLog();

  const pipelineSteps = useMemo(() => {
    const { pipelineSteps, pipelineError } = runPipeline(
      dataFile.pipeline,
      dataFile.image,
    );
    if (pipelineError !== undefined) logger.error(pipelineError);
    return pipelineSteps;
  }, [dataFile.image, dataFile.pipeline, logger]);

  const pipelined = useCallback(
    (toOperation?: string) => {
      if (toOperation === undefined) {
        return pipelineSteps.at(-1)?.result ?? dataFile.image;
      }

      const index =
        pipelineSteps.findIndex((step) => step.identifier === toOperation) - 1;

      if (index < 0) {
        return dataFile.image;
      }

      return pipelineSteps[index].result ?? dataFile.image;
    },
    [dataFile.image, pipelineSteps],
  );

  const content = useMemo(
    () => ({
      pipelined,
      original: dataFile.image,
    }),
    [dataFile.image, pipelined],
  );

  return (
    <PipelineContext.Provider value={content}>
      {children}
    </PipelineContext.Provider>
  );
}
