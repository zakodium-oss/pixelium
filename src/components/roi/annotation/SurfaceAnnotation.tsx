import { Roi } from 'image-js';
import { CSSProperties, memo, useMemo } from 'react';

import usePreferences from '../../../hooks/usePreferences';

interface SurfaceAnnotationProps {
  roi: Roi;
}

function SurfaceAnnotation({ roi }: SurfaceAnnotationProps) {
  const preferences = usePreferences();
  const { color, enabled } = preferences.rois.annotations.surface;

  const svgPath = useMemo(() => {
    const pathCommands: string[] = [];
    const mask = roi.getMask();
    const width = mask.width;
    const height = mask.height;
    for (let column = 0; column < width; column++) {
      for (let row = 0; row < height; row++) {
        if (mask.getBit(column, row) === 1) {
          pathCommands.push(`M${column},${row}`);

          if (row + 1 <= height) {
            pathCommands.push(`V${row + 1}`);
          }
          if (column + 1 <= width) {
            pathCommands.push(`H${column + 1}`);
          }
          pathCommands.push(`V${row}`);
        }
      }
    }
    return pathCommands.join(' ');
  }, [roi]);

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
