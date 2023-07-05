import useData from './useData';

export default function useROIs(identifier: string) {
  const data = useData();
  return data.images[identifier].rois;
}
