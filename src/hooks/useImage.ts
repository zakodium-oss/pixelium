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

  // if not bounded, execute the whole pipeline
  const executeAll = toOperation === undefined;
  if (executeAll) {
    return {
      original: dataFile.image,
      pipelined:
        dataFile.pipeline.findLast(
          (operation) => operation.isActive && operation.result !== undefined,
        )?.result || dataFile.image,
    };
  }

  // if bounded, execute until the operation before the target operation
  const executeTo =
    dataFile.pipeline.findIndex(
      (operation) => operation.identifier === toOperation,
    ) - 1;

  const pipelined =
    dataFile.pipeline.findLast(
      (operation, index) =>
        operation.isActive &&
        index <= executeTo &&
        operation.result !== undefined,
    )?.result || dataFile.image;

  return {
    original: dataFile.image,
    pipelined,
  };
}
