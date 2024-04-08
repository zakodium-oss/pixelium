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
import { getNotificationIntent } from '../../utils/colors';

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
      <Toolbar>
        <Toolbar.Item
          tooltip="About Pixelium"
          icon={<SvgLogoZakodium />}
          onClick={openAbout}
        />
      </Toolbar>

      <Toolbar>
        <Toolbar.Item
          tooltip="User manual"
          icon={<FaQuestionCircle />}
          onClick={() => window.open('https://zakodium.com', '_blank')}
        />
        <Toolbar.Item
          tooltip="Logs"
          icon={<FaBug />}
          tag={unreadCount > 0 && unreadCount}
          tagProps={{ intent: getNotificationIntent(unreadLevel) }}
          onClick={() => {
            openLogs();
            markAsRead();
          }}
        />
        <Toolbar.Item tooltip="Settings" icon={<FaWrench />} />
        {!isFullScreen && (
          <Toolbar.Item
            tooltip="Full Screen"
            icon={<FaRegWindowMaximize />}
            onClick={toggleFullscreen}
          />
        )}
      </Toolbar>
    </InnerHeader>
  );
}

export default memo(PixeliumHeader);
