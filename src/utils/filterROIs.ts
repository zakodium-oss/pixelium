import { Roi } from 'image-js';

import { RoiFilter } from '../components/context/ROIContext';

type FilterableROI = {
  id: number;
  column: number;
  row: number;
  width: number;
  height: number;
  surface: number;
  feretMinDiameter: number;
  feretMaxDiameter: number;
  feretAspectRatio: number;
  roundness: number;
  solidity: number;
  sphericity: number;
  fillRatio: number;
};

export default function filterROIs(
  rois: Roi[],
  filters: RoiFilter[],
  column?: string,
): FilterableROI[] {
  const formattedROIs = rois.map((roi) => ({
    id: roi.id,
    column: roi.origin.column,
    row: roi.origin.row,
    width: roi.width,
    height: roi.height,
    surface: roi.surface,
    feretMinDiameter: roi.feret.minDiameter.length,
    feretMaxDiameter: roi.feret.maxDiameter.length,
    feretAspectRatio: roi.feret.aspectRatio,
    roundness: roi.roundness,
    solidity: roi.solidity,
    sphericity: roi.sphericity,
    fillRatio: roi.fillRatio,
  }));

  const results = formattedROIs.filter((filteredROI) => {
    return filters.every((filter) => {
      if (filter.column === column) {
        return true;
      }
      if (filter.min && filter.max) {
        return (
          filteredROI[filter.column] >= filter.min &&
          filteredROI[filter.column] <= filter.max
        );
      } else if (filter.min) {
        return filteredROI[filter.column] >= filter.min;
      } else if (filter.max) {
        return filteredROI[filter.column] <= filter.max;
      }
      return true;
    });
  });
  return results;
}
