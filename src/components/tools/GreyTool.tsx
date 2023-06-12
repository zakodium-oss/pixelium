import { FaFilter } from 'react-icons/all';
import { Toolbar, useOnOff } from 'react-science/ui';

import useData from '../../hooks/useData';
import useView from '../../hooks/useView';
import isColor from '../../utils/isColor';
import ExploreGreyModal from '../modal/ExploreGreyModal';

export function GreyTool() {
  const [isOpenDialog, openDialog, closeDialog] = useOnOff(false);
  const { currentTab } = useView();
  const { files } = useData();

  if (currentTab === undefined) return null;
  if (!isColor(files[currentTab].image)) return null;

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