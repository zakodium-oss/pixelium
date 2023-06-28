import useData from './useData';

export default function useRois(identifier: string) {
  const data = useData();
  return data.images[identifier].rois;
}
