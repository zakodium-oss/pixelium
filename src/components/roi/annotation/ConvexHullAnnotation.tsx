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
  const { color, enabled, fontColor, fontSize, displayValue } =
    preferences.rois.annotations.convexHull;

  const polygonStyle: CSSProperties = useMemo(
    () => ({
      fill: 'none',
      stroke: color.hex,
      strokeOpacity: color.a,
      strokewidth: 1,
    }),
    [color],
  );
  const textStyle: CSSProperties = useMemo(
    () => ({
      fill: fontColor.hex,
      fillOpacity: fontColor.a,
      fontSize,
      textAnchor: 'middle',
      dominantBaseline: 'text-before-edge',
    }),
    [fontColor, fontSize],
  );

  if (!enabled && !displayValue) return null;

  return (
    <g>
      {enabled && <polygon points={svgPoints} style={polygonStyle} />}
      {displayValue && (
        <text x={roi.width / 2} y={roi.height + 1} style={textStyle}>
          {roi.convexHull.surface}
        </text>
      )}
    </g>
  );
}

export default memo(ConvexHullAnnotation);
