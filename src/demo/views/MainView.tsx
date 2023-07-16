import { css } from '@emotion/react';
import { WebSource } from 'filelist-utils';
import { memo, useState } from 'react';

import Pixelium from '../../components/Pixelium';
import Sidebar from '../Sidebar';

const wrapperStyle = css`
  display: flex;
  max-width: 100vw;
  height: 100vh;
  flex-direction: row;
  overflow: hidden;
`;

function MainView() {
  const [webSource, setWebSource] = useState<WebSource>();

  return (
    <div css={wrapperStyle}>
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
    </div>
  );
}

export default memo(MainView);
