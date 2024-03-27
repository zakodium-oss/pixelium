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
    const fields = Object.fromEntries(image.meta?.tiff?.fields || []);

    for (const [tagCode, tagValue] of Object.entries(fields)) {
      if (typeof tagValue === 'string' && tagValue.startsWith('<')) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(tagValue, 'text/xml');
        const dataNodes = xmlDoc.querySelectorAll('Data');
        const fieldInfo: Record<string, unknown> = {};
        for (const dataNode of dataNodes) {
          const label = dataNode.querySelector('Label')?.textContent;
          const value = dataNode.querySelector('Value')?.textContent;
          if (label && value) {
            fieldInfo[label] = value;
          }
        }
        fields[tagCode] = fieldInfo;
      }
    }

    const meta = {
      ...image.meta?.tiff?.tags,
      ...fields,
    };
    return { info, meta };
  }, [image]);
}
