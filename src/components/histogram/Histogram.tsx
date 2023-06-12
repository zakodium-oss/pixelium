import { Image } from 'image-js';
import { memo } from 'react';
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
          <Heading title={`Channel ${channel}`} />
        </Plot>
      )}
    </ResponsiveChart>
  );
}

export default memo(Histogram);
