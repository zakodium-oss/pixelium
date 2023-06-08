import { Image } from 'image-js';
import { useMemo } from 'react';
import { ValueRenderers } from 'react-science/ui';

export default function useImageInformations(image: Image | null) {
  return useMemo(() => {
    if (image === null) return [];
    return [
      {
        key: 'Image size',
        render: (
          <ValueRenderers.Text
            value={`${image.width.toLocaleString()} x ${image.height.toLocaleString()} (${(
              image.width * image.height
            ).toLocaleString()} pixels)`}
          />
        ),
      },
      {
        key: 'Bit depth',
        render: <ValueRenderers.Number value={image.bitDepth} />,
      },
      {
        key: 'Channels',
        render: <ValueRenderers.Number value={image.channels} />,
      },
      {
        key: 'Components',
        render: <ValueRenderers.Number value={image.components} />,
      },
      {
        key: 'Color model',
        render: <ValueRenderers.Text value={image.colorModel} />,
      },
    ];
  }, [image]);
}
