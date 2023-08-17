import { Image } from 'image-js';
import { useMemo } from 'react';

export default function useImageInformations(image: Image | null) {
  return useMemo(() => {
    if (image === null) return { info: {}, meta: {} };
    const info = {
      imageSize: `${image.width.toLocaleString()} x ${image.height.toLocaleString()} (${(
        image.width * image.height
      ).toLocaleString()} pixels)`,
      bitDepth: image.bitDepth,
      channels: image.channels,
      components: image.components,
      colorModel: image.colorModel,
    };
    const meta = image.meta?.tiff.tags || {};
    return { info, meta };
  }, [image]);
}
