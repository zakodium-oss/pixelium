import { Image, writeCanvas } from 'image-js';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { MapInteractionCSS } from 'react-map-interaction';

import useImage from '../hooks/useImage';
import useView from '../hooks/useView';
import useViewDispatch from '../hooks/useViewDispatch';
import { SET_PAN_ZOOM } from '../state/view/ViewActionTypes';

interface ImageViewerProps {
  identifier: string;
  image?: Image;
  showOriginal?: boolean;
}

function ImageViewer({
  identifier,
  showOriginal = false,
  image,
}: ImageViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const view = useView();
  const viewDispatch = useViewDispatch();

  const { original, pipelined } = useImage(identifier);

  const imageToShow = useMemo(() => {
    if (image !== undefined) return image;
    return showOriginal ? original : pipelined;
  }, [image, original, pipelined, showOriginal]);

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
    if (canvasRef.current === null) return;
    writeCanvas(imageToShow, canvasRef.current);
  }, [imageToShow]);

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
