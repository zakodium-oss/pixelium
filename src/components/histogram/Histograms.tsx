import styled from '@emotion/styled';
import times from 'lodash/times';
import { memo } from 'react';

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

  return (
    <HistogramsContainer>
      {times(pipelined.components, (i) => (
        <Histogram
          key={i}
          image={pipelined}
          colorModel={pipelined.colorModel}
          channel={i}
        />
      ))}
    </HistogramsContainer>
  );
}

export default memo(Histograms);
