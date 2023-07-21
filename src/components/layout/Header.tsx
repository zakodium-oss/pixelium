import styled from '@emotion/styled';
import { SvgLogoZakodium } from 'cheminfo-font';
import { memo } from 'react';
import {
  FaBug,
  FaQuestionCircle,
  FaRegWindowMaximize,
  FaWrench,
} from 'react-icons/fa';
import { Header as InnerHeader, Toolbar } from 'react-science/ui';
import { useFullscreen, useToggle } from 'react-use';

import useGlobal from '../../hooks/useGlobal';
import useLog from '../../hooks/useLog';
import useModal from '../../hooks/useModal';
import { getNotificationColor } from '../../utils/colors';

const UnreadChip = styled.span<{ unreadLevel: number }>`
  position: absolute;
  top: 0.5em;
  left: 0.5em;
  background-color: ${({ unreadLevel }) => getNotificationColor(unreadLevel)};
  border-radius: 50%;
  min-width: 14px;
  font-size: 0.75em;
  color: white;
`;

function PixeliumHeader() {
  const { rootRef } = useGlobal();
  const [show, toggleFullscreen] = useToggle(false);

  const { open: openLogs } = useModal('log');
  const { open: openAbout } = useModal('about');
  const { unreadLevel, unreadCount, markAsRead } = useLog();

  const isFullScreen = useFullscreen(rootRef, show, {
    onClose: () => toggleFullscreen(false),
  });

  return (
    <InnerHeader>
      <Toolbar orientation="horizontal">
        <Toolbar.Item
          title="About Pixelium"
          titleOrientation="horizontal"
          onClick={openAbout}
        >
          <SvgLogoZakodium />
        </Toolbar.Item>
      </Toolbar>

      <Toolbar orientation="horizontal">
        <Toolbar.Item
          title="User manual"
          onClick={() => window.open('https://zakodium.com', '_blank')}
        >
          <FaQuestionCircle />
        </Toolbar.Item>
        <Toolbar.Item
          title="Logs"
          titleOrientation="vertical"
          onClick={() => {
            openLogs();
            markAsRead();
          }}
        >
          <FaBug />
          {unreadCount > 0 && (
            <UnreadChip unreadLevel={unreadLevel}>{unreadCount}</UnreadChip>
          )}
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