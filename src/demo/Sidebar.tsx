import { css } from '@emotion/react';
import { memo } from 'react';

const sidebarStyle = css`
  display: flex;
  flex-direction: column;
  width: 200px;
  color: white;
  background-color: cornflowerblue;
  padding: 0 20px;

  h1 {
    font-size: 1.5rem;
    margin: 0;
    padding: 20px 0;
    border-bottom: 1px solid white;
  }
`;

function Sidebar() {
  return (
    <div css={sidebarStyle}>
      <h1>Pixelium</h1>
    </div>
  );
}

export default memo(Sidebar);
