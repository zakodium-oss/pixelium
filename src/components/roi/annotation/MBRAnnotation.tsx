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
  const { color, enabled, fontSize, fontColor, displayValue } =
    preferences.rois.annotations.minimalBoundingRectangle;

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
      dominantBaseline: 'text-after-edge',
    }),
    [fontColor, fontSize],
  );

  if (!enabled && !displayValue) return null;

  return (
    <g>
      {enabled && <polygon points={svgPoints} style={polygonStyle} />}
      {displayValue && (
        <text x={roi.width / 2} y={-1} style={textStyle}>
          {roi.width}x{roi.height} ({roi.surface}px)
        </text>
      )}
    </g>
  );
}

export default memo(MBRAnnotation);
