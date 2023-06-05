import { FaFilter } from 'react-icons/all';
import { Toolbar, useOnOff } from 'react-science/ui';

import useView from '../../hooks/useView';
import ExploreGreyModal from '../modal/ExploreGreyModal';

export function GreyTool() {
  const [isOpenDialog, openDialog, closeDialog] = useOnOff(false);
  const view = useView();

  if (view.currentTab === undefined) return null;

  return (
    <>
      <Toolbar.Item title="Grey filters" onClick={openDialog}>
        <FaFilter />
      </Toolbar.Item>
      <ExploreGreyModal isOpenDialog={isOpenDialog} closeDialog={closeDialog} />
    </>
  );
}
