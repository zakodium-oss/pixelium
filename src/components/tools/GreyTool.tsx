import { FaFilter } from 'react-icons/all';
import { Toolbar, useOnOff } from 'react-science/ui';

import useData from '../../hooks/useData';
import useView from '../../hooks/useView';
import isColor from '../../utils/isColor';
import ExploreGreyModal from '../modal/ExploreGreyModal';

export function GreyTool() {
  const [isOpenDialog, openDialog, closeDialog] = useOnOff(false);
  const { currentTab } = useView();
  const { images } = useData();

  const image = currentTab ? images[currentTab].image : undefined;

  if (currentTab === undefined) return null;
  if (image === undefined) return null;
  if (!isColor(image)) return null;

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
