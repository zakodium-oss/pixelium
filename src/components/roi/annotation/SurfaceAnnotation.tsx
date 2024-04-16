import { Roi, getMask } from 'image-js';
import { CSSProperties, memo, useMemo } from 'react';

import usePreferences from '../../../hooks/usePreferences';

interface SurfaceAnnotationProps {
  roi: Roi;
}

function SurfaceAnnotation({ roi }: SurfaceAnnotationProps) {
  const preferences = usePreferences();
  const { color, enabled } = preferences.rois.annotations.surface;

  const svgPath = useMemo(() => {
    if (!enabled) return '';
    const pathCommands: string[] = [];
    const mask = getMask(roi);
    const width = mask.width;
    const height = mask.height;
    for (let column = 0; column < width; column++) {
      for (let row = 0; row < height; row++) {
        if (mask.getBit(column, row) === 1) {
          pathCommands.push(`M${column},${row}`);
          let maxRow = 1;
          for (; row + maxRow <= height; maxRow++) {
            if (mask.getBit(column, row + maxRow) !== 1) {
              break;
            }
          }

          pathCommands.push(`V${row + maxRow}`, `H${column + 1}`, `V${row}`);
          row = row + maxRow;
        }
      }
    }
    return pathCommands.join(' ');
  }, [roi, enabled]);

  const pathStyle: CSSProperties = useMemo(
    () => ({
      fill: color.hex,
      fillOpacity: color.a,
    }),
    [color],
  );

  if (!enabled) return null;

  return <path d={svgPath} style={pathStyle} />;
}

export default memo(SurfaceAnnotation);
