import { Image } from 'image-js';
import { useMemo } from 'react';

import useLog from './useLog';

export default function useImageInformations(image: Image | null) {
  const { logger } = useLog();
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
    const fields = Object.fromEntries(image.meta?.tiff?.fields || []);
    let newFields: Record<string, unknown> = {};

    for (const [tagCode, tagValue] of Object.entries(fields)) {
      try {
        if (typeof tagValue === 'string' && tagValue.startsWith('<')) {
          let newTagCode = tagCode;
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(tagValue, 'text/xml');
          const dataNodes = xmlDoc.querySelectorAll('Data');
          for (const dataNode of dataNodes) {
            const label = dataNode.querySelector('Label')?.textContent;
            const value = dataNode.querySelector('Value')?.textContent;
            if (label && value) {
              newTagCode = tagCode.concat('.').concat(label);
              newFields[newTagCode] = value;
            }
          }
        } else {
          newFields[tagCode] = tagValue;
        }
      } catch (error) {
        logger.error(`Error parsing XML tag: ${error as string}`);
      }
    }

    const meta = {
      ...image.meta?.tiff?.tags,
      ...newFields,
    };
    return { info, meta };
  }, [image, logger]);
}
