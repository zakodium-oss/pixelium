import { memo, useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Toolbar } from 'react-science/ui';

import useDataDispatch from '../../hooks/useDataDispatch';
import useViewDispatch from '../../hooks/useViewDispatch';
import { CLOSE_IMAGE } from '../../state/data/DataActionTypes';
import { CLOSE_TAB } from '../../state/view/ViewActionTypes';

function CloseTool({ closeId }: { closeId: string }) {
  const dataDispatch = useDataDispatch();
  const viewDispatch = useViewDispatch();

  const closeImage = useCallback(() => {
    dataDispatch({ type: CLOSE_IMAGE, payload: closeId });
    viewDispatch({ type: CLOSE_TAB });
  }, [closeId, dataDispatch, viewDispatch]);

  return (
    <Toolbar.Item title="Close image" icon={<FaTimes />} onClick={closeImage} />
  );
}

export default memo(CloseTool);
