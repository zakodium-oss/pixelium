import { EMPTY_IMAGE } from '../utils/defaults';

import useData from './useData';

const DEFAULT = {
  original: EMPTY_IMAGE,
  pipelined: EMPTY_IMAGE,
};

export default function useImage(identifier?: string, toOperation?: string) {
  const { images } = useData();

  if (!identifier) return DEFAULT;
  const dataFile = images[identifier];
  if (!dataFile) return DEFAULT;

  const stopAt =
    dataFile.pipeline.findIndex(
      (operation) => operation.identifier === toOperation,
    ) - 1;

  const lastToExecute = stopAt >= 0 ? dataFile.pipeline[stopAt] : undefined;

  const pipelined =
    dataFile.pipeline.findLast(
      (operation) =>
        operation.isActive &&
        operation.result !== undefined &&
        (lastToExecute === undefined
          ? true
          : operation.identifier === lastToExecute.identifier),
    )?.result || dataFile.image;

  return {
    original: dataFile.image,
    pipelined,
  };
}
