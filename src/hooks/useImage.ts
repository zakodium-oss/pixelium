import { EMPTY_IMAGE } from '../utils/defaults';

import useData from './useData';

export default function useImage(identifier: string) {
  const { images } = useData();
  const dataFile = images[identifier];
  if (!dataFile) return { original: EMPTY_IMAGE, pipelined: EMPTY_IMAGE };

  return {
    original: dataFile.image,
    pipelined:
      dataFile.pipeline.findLast(
        (operation) => operation.isActive && operation.result !== undefined,
      )?.result || dataFile.image,
  };
}
