import { Image, channelLabels } from 'image-js';
import { memo, useCallback } from 'react';
import { ResponsiveChart } from 'react-d3-utils';
import { Axis, BarSeries, Heading, Plot } from 'react-plot';

interface HistogramProps {
  image: Image;
  channel: number;
}

function Histogram({ image, channel }: HistogramProps) {
  const values = image.histogram({ channel });

  const data = Array.from(values).map((value, index) => ({
    x: index,
    y: value,
  }));

  const title = useCallback(
    (channel: number) => {
      return `${channelLabels[image.colorModel][channel]} channel`;
    },
    [image.colorModel],
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
