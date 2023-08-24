import { Roi } from 'image-js';
import { memo, useMemo } from 'react';

import ConvexHullAnnotation from './ConvexHullAnnotation';
import FeretAnnotation from './FeretAnnotation';
import MBRAnnotation from './MBRAnnotation';
import SurfaceAnnotation from './SurfaceAnnotation';

interface ROIAnnotationProps {
  roi: Roi;
}
function ROIAnnotation({ roi }: ROIAnnotationProps) {
  const { column: x, row: y } = roi.origin;

  const transform = useMemo(() => `translate(${x}, ${y})`, [x, y]);

  return (
    <g transform={transform}>
      <SurfaceAnnotation roi={roi} />
      <MBRAnnotation roi={roi} />
      <FeretAnnotation roi={roi} />
      <ConvexHullAnnotation roi={roi} />
    </g>
  );
}

export default memo(ROIAnnotation);
