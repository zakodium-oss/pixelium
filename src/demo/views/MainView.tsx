import styled from '@emotion/styled';
import { WebSource } from 'filelist-utils';
import { memo, useState } from 'react';

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
  const [webSource, setWebSource] = useState<WebSource>();

  return (
    <PixeliumProvider webSource={webSource} setWebSource={setWebSource}>
      <MainViewWrapper>
        <Sidebar setWebSource={setWebSource} />
        <PixeliumWrapper>
          <PixeliumApp />
        </PixeliumWrapper>
      </MainViewWrapper>
    </PixeliumProvider>
  );
}

export default memo(MainView);
