import { memo } from 'react';
import { FaMask } from 'react-icons/fa';
import { Toolbar } from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import useImage from '../../hooks/useImage';
import useModal from '../../hooks/useModal';
import isGrey from '../../utils/isGrey';

function MaskTool() {
  const { open } = useModal('mask');
  const currentTab = useCurrentTab();

  const { pipelined } = useImage(currentTab || '');

  if (currentTab === undefined) return null;
  if (pipelined === undefined) return null;
  if (!isGrey(pipelined)) return null;

  return (
    <Toolbar.Item title="Mask" onClick={open}>
      <FaMask />
    </Toolbar.Item>
  );
}

export default memo(MaskTool);
