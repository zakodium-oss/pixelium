import useFilteredROIs from './useFilteredROIs';
import useROIs from './useROIs';

export default function useOriginalFilteredROIs(identifier: string) {
  const rois = useROIs(identifier);
  const filteredROIs = useFilteredROIs(identifier);

  const originalFilteredROIs = rois.filter((roi) =>
    filteredROIs.some((filteredROI) => filteredROI.id === roi.id),
  );

  return originalFilteredROIs;
}
