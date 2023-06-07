import { css } from '@emotion/react';
import { memo } from 'react';

import Pixelium from '../../components/Pixelium';
import Sidebar from '../Sidebar';

const wrapperStyle = css`
  display: flex;
  height: 100vh;
  flex-direction: row;
  overflow: hidden;
`;

function MainView() {
  return (
    <div css={wrapperStyle}>
      <Sidebar />
      <div style={{ padding: '20px', backgroundColor: 'lightgray', flex: '1' }}>
        <Pixelium />
      </div>
    </div>
  );
}

export default memo(MainView);
