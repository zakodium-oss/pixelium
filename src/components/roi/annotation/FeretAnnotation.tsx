import { Roi } from 'image-js';
import { CSSProperties, memo, useMemo } from 'react';

import usePreferences from '../../../hooks/usePreferences';

interface FeretAnnotationProps {
  roi: Roi;
}

function FeretAnnotation({ roi }: FeretAnnotationProps) {
  const { minDiameter, maxDiameter } = roi.feret;

  const lines = useMemo(
    () =>
      [minDiameter, maxDiameter].map(
        ({
          points: [
            { column: columnA, row: rowA },
            { column: columnB, row: rowB },
          ],
          length,
        }) => ({
          x1: columnA,
          y1: rowA,
          x2: columnB,
          y2: rowB,
          length,
        }),
      ),
    [maxDiameter, minDiameter],
  );

  const preferences = usePreferences();
  const { color, enabled, fontColor, fontSize, displayValue } =
    preferences.rois.annotations.feretDiameters;

  const lineStyle: CSSProperties = useMemo(
    () => ({
      fill: 'none',
      stroke: color,
      strokewidth: 2,
    }),
    [color],
  );

  const textStyle: CSSProperties = useMemo(
    () => ({
      fill: fontColor,
      fontSize,
      textAnchor: 'middle',
      dominantBaseline: 'central',
    }),
    [fontColor, fontSize],
  );

  if (!enabled) return null;

  return (
    <>
      {lines.map(({ x1, y1, x2, y2, length }, index) => {
        const rotation = Math.atan((y2 - y1) / (x2 - x1)) * (180 / Math.PI);
        const x = x2 > x1 ? (x2 + x1 + 2) / 2 : (x2 + x1 - 2) / 2;
        const y = y1 > y2 ? (y2 + y1 + 2) / 2 : (y2 + y1 - 2) / 2;
        return (
          <g
            // eslint-disable-next-line react/no-array-index-key
            key={`${roi.id}-${index}`}
          >
            <line x1={x1} y1={y1} x2={x2} y2={y2} style={lineStyle} />
            {displayValue && (
              <text
                x={0}
                y={0}
                transform={`translate(${x}, ${y})  rotate(${rotation})`}
                style={textStyle}
              >
                {length.toFixed(2)}
              </text>
            )}
          </g>
        );
      })}
    </>
  );
}

export default memo(FeretAnnotation);
