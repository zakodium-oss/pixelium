import { Roi } from 'image-js';
import { CSSProperties, memo, useMemo } from 'react';

import usePreferences from '../../../hooks/usePreferences';

interface SurfaceAnnotationProps {
  roi: Roi;
}

function SurfaceAnnotation({ roi }: SurfaceAnnotationProps) {
  const preferences = usePreferences();

  const { color, enabled } = preferences.rois.annotations.surface;

  const rectStyle: CSSProperties = useMemo(
    () => ({
      fill: color,
      stroke: color,
      strokeWidth: 0.1,
    }),
    [color],
  );

  if (!enabled) return null;

  return roi.points.map(([column, row]) => (
    <rect
      key={`${column}-${row}`}
      x={column}
      y={row}
      width="1"
      height="1"
      style={rectStyle}
    />
  ));
}

export default memo(SurfaceAnnotation);
