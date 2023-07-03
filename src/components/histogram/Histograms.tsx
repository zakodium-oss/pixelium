import styled from '@emotion/styled';
import { Image, ImageColorModel } from 'image-js';
import times from 'lodash/times';
import { memo, useMemo } from 'react';

import useImage from '../../hooks/useImage';

import Histogram from './Histogram';

const HistogramsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 8px 0;
`;

function Histograms() {
  const { pipelined } = useImage();

  const image = useMemo(
    () =>
      pipelined instanceof Image
        ? pipelined
        : pipelined.convertColor(ImageColorModel.GREY),
    [pipelined],
  );

  return (
    <HistogramsContainer>
      {times(image.components, (i) => (
        <Histogram
          key={i}
          image={image}
          colorModel={pipelined.colorModel}
          channel={i}
        />
      ))}
    </HistogramsContainer>
  );
}

export default memo(Histograms);
