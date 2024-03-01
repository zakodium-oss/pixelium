import { memo, useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Toolbar } from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import useDataDispatch from '../../hooks/useDataDispatch';
import useViewDispatch from '../../hooks/useViewDispatch';
import { CLOSE_IMAGE } from '../../state/data/DataActionTypes';
import { CLOSE_TAB } from '../../state/view/ViewActionTypes';

function CloseTool() {
  const dataDispatch = useDataDispatch();
  const viewDispatch = useViewDispatch();

  const currentTab = useCurrentTab();

  const closeImage = useCallback(() => {
    if (currentTab === undefined) return;
    dataDispatch({ type: CLOSE_IMAGE, payload: currentTab });
    viewDispatch({ type: CLOSE_TAB });
  }, [currentTab, dataDispatch, viewDispatch]);

  if (currentTab === undefined) return null;

  return (
    <Toolbar.Item
      title="Close current image"
      icon={<FaTimes />}
      onClick={closeImage}
    />
  );
}

export default memo(CloseTool);
