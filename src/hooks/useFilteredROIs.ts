import useROIContext from '../components/context/ROIContext';
import filterROIs from '../utils/filterROIs';

import useROIs from './useROIs';

export default function useFilteredROIs(identifier: string) {
  const rois = useROIs(identifier);
  const { filters } = useROIContext();

  return filterROIs(rois, filters);
}
