import styled from '@emotion/styled';
import { Image, Mask, writeCanvas } from 'image-js';
import {
  CSSProperties,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { MapInteractionCSS } from 'react-map-interaction';

import useImage from '../hooks/useImage';
import useView from '../hooks/useView';
import useViewDispatch from '../hooks/useViewDispatch';
import { SET_PAN_ZOOM } from '../state/view/ViewActionTypes';

import ROIAnnotations from './rois/ROIAnnotations';

interface ImageViewerProps {
  identifier: string;
  image?: Image | Mask;
  showOriginal?: boolean;
  annotable?: boolean;
}

const RelativeBox = styled.div`
  position: relative;
`;

const canvasStyle: CSSProperties = {
  objectFit: 'contain',
  imageRendering: 'pixelated',
};

function ImageViewer({
  identifier,
  showOriginal = false,
  image,
  annotable = false,
}: ImageViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const view = useView();
  const viewDispatch = useViewDispatch();

  const { original, pipelined } = useImage();

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
    <MapInteractionCSS value={panZoom} onChange={setPanZoom} maxScale={20}>
      <RelativeBox>
        <canvas ref={canvasRef} style={canvasStyle} />
        {annotable && (
          <ROIAnnotations
            width={imageToShow?.width}
            height={imageToShow?.height}
            identifier={identifier}
          />
        )}
      </RelativeBox>
    </MapInteractionCSS>
  );
}

export default memo(ImageViewer);
