import { Roi } from 'image-js';
import { CSSProperties, memo, useMemo } from 'react';

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

  const polygonStyle: CSSProperties = useMemo(
    () => ({
      fill: 'none',
      stroke: color,
      strokewidth: 1,
    }),
    [color],
  );

  if (!preferences.rois.annotations.minimalBoundingRectangle.enabled) {
    return null;
  }

  return <polygon points={svgPoints} style={polygonStyle} />;
}

export default memo(MBRAnnotation);
