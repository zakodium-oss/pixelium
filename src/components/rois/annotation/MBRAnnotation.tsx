import { Roi } from 'image-js';
import { memo, useMemo } from 'react';

import usePreferences from '../../../hooks/usePreferences';

interface MBRAnnotationProps {
  roi: Roi;
}

function MBRAnnotation({ roi }: MBRAnnotationProps) {
  const svgPoints = useMemo(
    () =>
      roi.mbr.points
        .map((corner) => `${corner.column},${corner.row}`)
        .join(' '),
    [roi.mbr.points],
  );
  const preferences = usePreferences();
  const color = useMemo(
    () => preferences.rois.annotations.minimalBoundingRectangle.color,
    [preferences.rois.annotations.minimalBoundingRectangle.color],
  );

  if (!preferences.rois.annotations.minimalBoundingRectangle.enabled) {
    return null;
  }

  return (
    <polygon
      points={svgPoints}
      style={{ fill: 'none', stroke: color, strokeWidth: 1 }}
    />
  );
}

export default memo(MBRAnnotation);
