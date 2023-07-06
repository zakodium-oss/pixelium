import { memo, useMemo } from 'react';

import useROIs from '../../hooks/useROIs';

import ROIAnnotation from './annotation/ROIAnnotation';

interface ROIAnnotationsProps {
  identifier: string;
  width?: number;
  height?: number;
}

function ROIAnnotations({
  identifier,
  width = 0,
  height = 0,
}: ROIAnnotationsProps) {
  const rois = useROIs(identifier);
  const annotations = useMemo(
    () => rois.map((roi) => <ROIAnnotation key={roi.id} roi={roi} />),
    [rois],
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width,
        height,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
      >
        {annotations}
      </svg>
    </div>
  );
}

export default memo(ROIAnnotations);
