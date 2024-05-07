import { Roi } from 'image-js';

import useROIContext from '../components/context/ROIContext';

import useROIs from './useROIs';

export type RoiDataType = {
  id?: number;
  column?: number;
  row?: number;
  width?: number;
  height?: number;
  surface?: number;
  feretMinDiameter?: number;
  feretMaxDiameter?: number;
  feretAspectRatio?: number;
  roundness?: number;
  solidity?: number;
  sphericity?: number;
  fillRatio?: number;
};

export function getRealFilteredROIs(rois: Roi[], filteredROIs: RoiDataType[]) {
  const result = rois.filter((roi) =>
    filteredROIs.some((filteredROI) => filteredROI.id === roi.id),
  );
  return result;
}

export default function useROIFilters({
  identifier,
  exclude,
}: {
  identifier: string;
  exclude?: string;
}) {
  const rois = useROIs(identifier);
  const { filters } = useROIContext();

  let filteredROIs: RoiDataType[] = rois.map((roi) => ({
    id: roi.id,
    column: roi.origin.column,
    row: roi.origin.row,
    width: roi.width,
    height: roi.height,
    surface: roi.surface,
    feretMinDiameter: Number(roi.feret.minDiameter.length.toFixed(2)),
    feretMaxDiameter: Number(roi.feret.maxDiameter.length.toFixed(2)),
    feretAspectRatio: Number(roi.feret.aspectRatio.toFixed(2)),
    roundness: Number(roi.roundness.toFixed(2)),
    solidity: Number(roi.solidity.toFixed(2)),
    sphericity: Number(roi.sphericity.toFixed(2)),
    fillRatio: Number(roi.fillRatio.toFixed(2)),
  }));

  filteredROIs = filteredROIs.filter((filteredROI) => {
    return filters.every((filter) => {
      if (filter.column === exclude) {
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

  return { filteredROIs };
}
