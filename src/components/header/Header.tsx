import { memo } from 'react';
import {
  FaQuestionCircle,
  FaRegWindowMaximize,
  FaWrench,
} from 'react-icons/all';
import { Header as InnerHeader, Toolbar } from 'react-science/ui';
import { useFullscreen, useToggle } from 'react-use';

import useGlobal from '../../hooks/useGlobal';
import AboutModal from '../modal/AboutModal';

function PixeliumHeader() {
  const { rootRef } = useGlobal();
  const [show, toggleFullscreen] = useToggle(false);

  const isFullScreen = useFullscreen(rootRef, show, {
    onClose: () => toggleFullscreen(false),
  });

  return (
    <InnerHeader>
      <Toolbar orientation="horizontal">
        <AboutModal />
      </Toolbar>

      <Toolbar orientation="horizontal">
        <Toolbar.Item
          title="User manual"
          onClick={() => window.open('https://zakodium.com', '_blank')}
        >
          <FaQuestionCircle />
        </Toolbar.Item>
        <Toolbar.Item title="Settings">
          <FaWrench />
        </Toolbar.Item>
        {!isFullScreen && (
          <Toolbar.Item title="Full Screen" onClick={toggleFullscreen}>
            <FaRegWindowMaximize />
          </Toolbar.Item>
        )}
      </Toolbar>
    </InnerHeader>
  );
}

export default memo(PixeliumHeader);
