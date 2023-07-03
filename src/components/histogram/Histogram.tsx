import { Image, channelLabels, ImageColorModel } from 'image-js';
import { memo, useCallback } from 'react';
import { ResponsiveChart } from 'react-d3-utils';
import { Axis, BarSeries, Heading, Plot } from 'react-plot';

interface HistogramProps {
  image: Image;
  colorModel: ImageColorModel;
  channel: number;
}

function Histogram({ image, colorModel, channel }: HistogramProps) {
  const values = image.histogram({ channel });

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
