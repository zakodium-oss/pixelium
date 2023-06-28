import { EMPTY_IMAGE } from '../utils/defaults';

import useData from './useData';

const DEFAULT = {
  original: EMPTY_IMAGE,
  pipelined: EMPTY_IMAGE,
};

export default function useImage(identifier?: string) {
  const { images } = useData();

  if (!identifier) return DEFAULT;
  const dataFile = images[identifier];
  if (!dataFile) return DEFAULT;

  const pipelined =
    dataFile.pipeline.findLast(
      (operation) => operation.isActive && operation.result !== undefined,
    )?.result || dataFile.image;

  return {
    original: dataFile.image,
    pipelined,
  };
}
