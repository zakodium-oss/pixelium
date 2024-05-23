import useData from './useData';

export default function useROIs(identifier?: string) {
  const data = useData();
  const rois =
    identifier && data.images[identifier]?.rois !== undefined
      ? data.images[identifier]?.rois
      : [];
  return rois;
}
