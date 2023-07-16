import styled from '@emotion/styled';
import { WebSource } from 'filelist-utils';
import { memo, useState } from 'react';

import Pixelium from '../../components/Pixelium';
import Sidebar from '../Sidebar';

const MainViewWrapper = styled.div`
  display: flex;
  max-width: 100vw;
  height: 100vh;
  flex-direction: row;
  overflow: hidden;
`;

function MainView() {
  const [webSource, setWebSource] = useState<WebSource>();

  return (
    <MainViewWrapper>
      <Sidebar setWebSource={setWebSource} />
      <div
        style={{
          padding: '20px',
          backgroundColor: 'lightgray',
          flex: '1',
          minWidth: '0',
        }}
      >
        <Pixelium webSource={webSource} />
      </div>
    </MainViewWrapper>
  );
}

export default memo(MainView);
