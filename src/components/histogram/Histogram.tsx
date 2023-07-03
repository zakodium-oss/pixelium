import { Image, channelLabels, ImageColorModel, Mask } from 'image-js';
import { memo, useCallback, useMemo } from 'react';
import { ResponsiveChart } from 'react-d3-utils';
import { Axis, BarSeries, Heading, Plot } from 'react-plot';

interface HistogramProps {
  image: Image | Mask;
  colorModel: ImageColorModel;
  channel: number;
}

function Histogram({ image, colorModel, channel }: HistogramProps) {
  const converted = useMemo(
    () =>
      image instanceof Image ? image : image.convertColor(ImageColorModel.GREY),
    [image],
  );

  const slots = useMemo(() => {
    const { bitDepth, maxValue } = image;
    return bitDepth <= 8 ? maxValue + 1 : 2 ** 8;
  }, [image]);

  const values = useMemo(
    () => converted.histogram({ channel, slots }),
    [channel, converted, slots],
  );

  const data = Array.from(values).map((value, index) => ({
    x: index,
    y: value,
  }));

  const title = useCallback(
    (channel: number) => {
      return `${channelLabels[colorModel][channel]} channel`;
    },
    [colorModel],
  );

  return (
    <ResponsiveChart>
      {({ width, height }) => (
        <Plot
          width={width}
          height={height}
          margin={{ bottom: 20, left: 20, top: 20, right: 20 }}
        >
          <BarSeries data={data} />
          <Axis position="bottom" label="Intensity" />
          <Axis position="left" label="Pixel count" />
          <Heading title={title(channel)} />
        </Plot>
      )}
    </ResponsiveChart>
  );
}

export default memo(Histogram);
