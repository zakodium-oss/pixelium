import { FaFilter } from 'react-icons/all';
import { Toolbar, useOnOff } from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import useImage from '../../hooks/useImage';
import isColor from '../../utils/isColor';
import ExploreGreyModal from '../modal/ExploreGreyModal';

export function GreyTool() {
  const [isOpenDialog, openDialog, closeDialog] = useOnOff(false);
  const currentTab = useCurrentTab();

  const { pipelined } = useImage(currentTab || '');

  if (currentTab === undefined) return null;
  if (pipelined === undefined) return null;
  if (!isColor(pipelined)) return null;

  return (
    <>
      <Toolbar.Item title="Grey filters" onClick={openDialog}>
        <FaFilter />
      </Toolbar.Item>
      <ExploreGreyModal
        isOpenDialog={isOpenDialog}
        closeDialog={closeDialog}
        previewImageIdentifier={currentTab}
      />
    </>
  );
}
