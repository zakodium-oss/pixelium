import { Roi } from 'image-js';
import { memo, useMemo } from 'react';

import usePreferences from '../../../hooks/usePreferences';

interface ConvexHullAnnotationProps {
  roi: Roi;
}

function ConvexHullAnnotation({ roi }: ConvexHullAnnotationProps) {
  const svgPoints = useMemo(
    () =>
      roi.convexHull.points
        .map((corner) => `${corner.column},${corner.row}`)
        .join(' '),
    [roi.convexHull.points],
  );

  const preferences = usePreferences();
  const color = useMemo(
    () => preferences.rois.annotations.convexHull.color,
    [preferences.rois.annotations.convexHull.color],
  );

  if (!preferences.rois.annotations.convexHull.enabled) return null;

  return (
    <polygon
      points={svgPoints}
      style={{ fill: 'none', stroke: color, strokeWidth: 1 }}
    />
  );
}

export default memo(ConvexHullAnnotation);
