import { fromMask, Image } from 'image-js';
import { memo, useCallback } from 'react';
import { LuFocus } from 'react-icons/lu';
import { Toolbar } from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import useDataDispatch from '../../hooks/useDataDispatch';
import useImage from '../../hooks/useImage';
import isBinary from '../../utils/isBinary';

function ROITool() {
  const currentTab = useCurrentTab();

  const { pipelined } = useImage(currentTab);

  const dataDispatch = useDataDispatch();

  const extract = useCallback(() => {
    if (pipelined instanceof Image) return;
    const roiMapManager = fromMask(pipelined);
    dataDispatch({
      type: 'SET_ROI',
      payload: {
        identifier: currentTab || '',
        rois: roiMapManager.getRois(),
      },
    });
  }, [currentTab, dataDispatch, pipelined]);

  if (currentTab === undefined) return null;
  if (pipelined === undefined) return null;
  if (!isBinary(pipelined)) return null;

  return (
    <Toolbar.Item title="Extract ROI" onClick={extract}>
      <LuFocus />
    </Toolbar.Item>
  );
}

export default memo(ROITool);
