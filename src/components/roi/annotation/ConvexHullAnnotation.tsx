import { Roi } from 'image-js';
import { CSSProperties, memo, useMemo } from 'react';

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

  const polygonStyle: CSSProperties = useMemo(
    () => ({
      fill: 'none',
      stroke: color,
      strokewidth: 1,
    }),
    [color],
  );

  if (!preferences.rois.annotations.convexHull.enabled) return null;

  return <polygon points={svgPoints} style={polygonStyle} />;
}

export default memo(ConvexHullAnnotation);
