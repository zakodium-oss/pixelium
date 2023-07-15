import { memo } from 'react';
import { LuFocus } from 'react-icons/lu';
import { Toolbar } from 'react-science/ui';

import useImage from '../../hooks/useImage';
import useModal from '../../hooks/useModal';
import isBinary from '../../utils/isBinary';

function ROITool() {
  const { open } = useModal('extractROI');
  const { pipelined } = useImage();

  if (pipelined === undefined) return null;
  if (!isBinary(pipelined)) return null;

  return (
    <Toolbar.Item title="Extract ROI" onClick={open}>
      <LuFocus />
    </Toolbar.Item>
  );
}

export default memo(ROITool);
