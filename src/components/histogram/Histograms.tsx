import styled from '@emotion/styled';
import { Image } from 'image-js';
import { memo } from 'react';

import Histogram from './Histogram';

interface HistogramsProps {
  image: Image;
}

const HistogramsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 8px 0;
`;
function Histograms({ image }: HistogramsProps) {
  return (
    <HistogramsContainer>
      {[...new Array(image.components).keys()].map((channel) => (
        <Histogram key={channel} image={image} channel={channel} />
      ))}
    </HistogramsContainer>
  );
}

export default memo(Histograms);
