import { useMemo } from 'react';

import useROIContext from '../components/context/ROIContext';

import useROIs from './useROIs';

export type FilterableROI = {
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

type MinMaxValue = {
  column: string;
  min: number;
  max: number;
};

export default function useROIFilters({
  identifier,
  exclude,
}: {
  identifier: string;
  exclude?: string;
}) {
  const rois = useROIs(identifier);
  const { filters } = useROIContext();

  const filteredROIs: FilterableROI[] = useMemo(() => {
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

    return results;
  }, [exclude, filters, rois]);

  const minMaxValues = useMemo(() => {
    let values: MinMaxValue[] = [];
    for (const column of Object.keys(filteredROIs[0])) {
      const colValues = filteredROIs.map((roi) => roi[column]);
      const min = Math.min(...colValues);
      const max = Math.max(...colValues);
      values.push({ column, min, max });
    }
    return values;
  }, [filteredROIs]);

  return { filteredROIs, minMaxValues };
}
