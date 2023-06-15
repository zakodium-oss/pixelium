import { Image, writeCanvas } from 'image-js';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { MapInteractionCSS } from 'react-map-interaction';

import useData from '../hooks/useData';
import useView from '../hooks/useView';
import useViewDispatch from '../hooks/useViewDispatch';
import { SET_PAN_ZOOM } from '../state/view/ViewActionTypes';

interface ImageViewerProps {
  identifier: string;
  image?: Image;
}

function ImageViewer({ identifier, image }: ImageViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const view = useView();
  const viewDispatch = useViewDispatch();

  const { images } = useData();

  const originalImage = useMemo(
    () => (image === undefined ? images[identifier].image : image),
    [images, identifier, image],
  );

  const panZoom = useMemo(
    () =>
      view.imageViewerProps[identifier] || {
        translation: { x: 0, y: 0 },
        scale: 1,
      },
    [identifier, view.imageViewerProps],
  );

  const setPanZoom = useCallback(
    (panZoom) => {
      viewDispatch({
        type: SET_PAN_ZOOM,
        payload: { identifier, panZoom },
      });
    },
    [identifier, viewDispatch],
  );

  useEffect(() => {
    if (originalImage === undefined || canvasRef.current === null) return;
    writeCanvas(originalImage, canvasRef.current);
  }, [originalImage]);

  return (
    <MapInteractionCSS value={panZoom} onChange={setPanZoom}>
      <div style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        />
      </div>
    </MapInteractionCSS>
  );
}

export default memo(ImageViewer);
