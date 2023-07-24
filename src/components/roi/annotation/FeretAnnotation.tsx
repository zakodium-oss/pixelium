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
        }) => ({
          x1: columnA,
          y1: rowA,
          x2: columnB,
          y2: rowB,
        }),
      ),
    [maxDiameter, minDiameter],
  );

  const preferences = usePreferences();
  const color = useMemo(
    () => preferences.rois.annotations.feretDiameters.color,
    [preferences.rois.annotations.feretDiameters.color],
  );

  const lineStyle: CSSProperties = useMemo(
    () => ({
      fill: 'none',
      stroke: color,
      strokewidth: 1,
    }),
    [color],
  );

  if (!preferences.rois.annotations.feretDiameters.enabled) return null;

  return (
    <>
      {lines.map(({ x1, y1, x2, y2 }, index) => (
        <line
          // eslint-disable-next-line react/no-array-index-key
          key={`${roi.id}-${index}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          style={lineStyle}
        />
      ))}
    </>
  );
}

export default memo(FeretAnnotation);
