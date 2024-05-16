import { memo, useEffect, useMemo, useRef } from 'react';

import useAnnotationRef from '../../hooks/useAnnotationRef';
import useROIs from '../../hooks/useROIs';

import ROIAnnotation from './annotation/ROIAnnotation';
import { usePanZoomTransform } from 'react-roi/lib-esm/hooks/usePanZoom';

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

  const annotationsRef = useRef<SVGSVGElement>(null);
  const { svgRef, setSvgRef } = useAnnotationRef();

  useEffect(() => {
    if (annotationsRef.current === null) return;
    setSvgRef(annotationsRef);
  }, [setSvgRef, svgRef]);

  const transform = usePanZoomTransform();

  return (
    <div style={{ width, height }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform, transformOrigin: '0px 0px' }}
        viewBox={`0 0 ${width} ${height}`}
        ref={annotationsRef}
      >
        {annotations}
      </svg>
    </div>
  );
}

export default memo(ROIAnnotations);
