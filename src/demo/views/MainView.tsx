import styled from '@emotion/styled';
import { memo } from 'react';

import PixeliumApp from '../../components/PixeliumApp';
import PixeliumProvider from '../../components/PixeliumProvider';
import Sidebar from '../Sidebar';

const MainViewWrapper = styled.div`
  display: flex;
  max-width: 100vw;
  height: 100vh;
  flex-direction: row;
  overflow: hidden;
`;

const PixeliumWrapper = styled.div`
  flex: 1;
  padding: 20px;
  background-color: lightgray;
  min-width: 0;
`;

function MainView() {
  return (
    <PixeliumProvider>
      <MainViewWrapper>
        <Sidebar />
        <PixeliumWrapper>
          <PixeliumApp />
        </PixeliumWrapper>
      </MainViewWrapper>
    </PixeliumProvider>
  );
}

export default memo(MainView);
