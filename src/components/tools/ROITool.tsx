import { memo } from 'react';
import { LuFocus } from 'react-icons/lu';
import { Toolbar } from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import useImage from '../../hooks/useImage';
import isBinary from '../../utils/isBinary';

function ROITool() {
  const currentTab = useCurrentTab();

  const { pipelined } = useImage(currentTab || '');

  if (currentTab === undefined) return null;
  if (pipelined === undefined) return null;
  if (!isBinary(pipelined)) return null;

  return (
    <Toolbar.Item title="Extract ROI">
      <LuFocus />
    </Toolbar.Item>
  );
}

export default memo(ROITool);
