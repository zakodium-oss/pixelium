import useROIFilters from './useROIFilters';
import useROIs from './useROIs';

export default function useOriginalFilteredROIs(identifier: string) {
  const rois = useROIs(identifier);
  const { filteredROIs } = useROIFilters({ identifier });

  const originalFilteredROIs = rois.filter((roi) =>
    filteredROIs.some((filteredROI) => filteredROI.id === roi.id),
  );

  return originalFilteredROIs;
}
