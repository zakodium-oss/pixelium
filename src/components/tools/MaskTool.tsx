import { memo } from 'react';
import { FaMask } from 'react-icons/fa';
import { Toolbar, useOnOff } from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import useImage from '../../hooks/useImage';
import isGrey from '../../utils/isGrey';
import ExploreMaskModal from '../modal/ExploreMaskModal';

function MaskTool() {
  const [isOpenDialog, openDialog, closeDialog] = useOnOff(false);
  const currentTab = useCurrentTab();

  const { pipelined } = useImage(currentTab || '');

  if (currentTab === undefined) return null;
  if (pipelined === undefined) return null;
  if (!isGrey(pipelined)) return null;

  return (
    <>
      <Toolbar.Item title="Mask" onClick={openDialog}>
        <FaMask />
      </Toolbar.Item>
      <ExploreMaskModal
        isOpenDialog={isOpenDialog}
        closeDialog={closeDialog}
        previewImageIdentifier={currentTab}
      />
    </>
  );
}

export default memo(MaskTool);
