import { memo, useEffect, useMemo, useRef } from 'react';
import { usePanZoomTransform } from 'react-roi';

import useAnnotationRef from '../../hooks/useAnnotationRef';
import useOriginalFilteredROIs from '../../hooks/useOriginalFilteredROIs';

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
  const originalFilteredROIs = useOriginalFilteredROIs(identifier);

  const annotations = useMemo(
    () =>
      originalFilteredROIs.map((roi) => (
        <ROIAnnotation key={roi.id} roi={roi} />
      )),
    [originalFilteredROIs],
  );

  const annotationsRef = useRef<SVGSVGElement>(null);
  const { svgRef, setSvgRef } = useAnnotationRef();

  useEffect(() => {
    if (annotationsRef.current === null) return;
    setSvgRef(annotationsRef);
  }, [setSvgRef, svgRef, annotations]);

  const transform = usePanZoomTransform();

  return (
    <div style={{ width, height, transform, transformOrigin: '0px 0px' }}>
      {annotations.length > 0 && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${width} ${height}`}
          ref={annotationsRef}
        >
          {annotations}
        </svg>
      )}
    </div>
  );
}

export default memo(ROIAnnotations);
