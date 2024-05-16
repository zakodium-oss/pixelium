import { useCallback, useMemo } from 'react';

import useROIContext, {
  RoiFilter,
  useROIDispatch,
} from '../components/context/ROIContext';
import filterROIs from '../utils/filterROIs';

import useROIs from './useROIs';

export default function useROIFilter({
  identifier,
  column,
}: {
  identifier: string;
  column: string;
}) {
  const rois = useROIs(identifier);
  const { filters } = useROIContext();
  const roiDispatch = useROIDispatch();

  const filteredColumn = filterROIs(rois, filters, column).map(
    (roi) => roi[column],
  );

  const minMax = useMemo(() => {
    return {
      column,
      min: Math.min(...filteredColumn),
      max: Math.max(...filteredColumn),
    };
  }, [filteredColumn, column]);

  const columnFilter = filters.find((f) => f.column === column) ?? minMax;

  let stepSize = 1;
  for (const roi of filteredColumn) {
    if (!Number.isInteger(roi)) {
      stepSize = 0.01;
      break;
    }
  }

  const updateMin = useCallback(
    (newFilter: RoiFilter) => {
      roiDispatch({
        type: 'UPDATE_MIN',
        payload: {
          roiFilter: newFilter,
          min: minMax.min,
          max: minMax.max,
        },
      });
    },
    [minMax, roiDispatch],
  );

  const updateMax = useCallback(
    (newFilter: RoiFilter) => {
      roiDispatch({
        type: 'UPDATE_MAX',
        payload: {
          roiFilter: newFilter,
          min: minMax.min,
          max: minMax.max,
        },
      });
    },
    [minMax, roiDispatch],
  );

  const removeFilter = useCallback(() => {
    roiDispatch({
      type: 'REMOVE_FILTER',
      payload: {
        column,
      },
    });
  }, [column, roiDispatch]);

  return {
    filteredColumn,
    columnFilter,
    minMax,
    stepSize,
    updateMin,
    updateMax,
    removeFilter,
  };
}
