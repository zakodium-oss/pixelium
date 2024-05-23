import { Menu, MenuItem } from '@blueprintjs/core';
import { memo, useCallback, useMemo } from 'react';
import { FaRecordVinyl } from 'react-icons/fa';
import { Toolbar, ToolbarItemProps } from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import useImage from '../../hooks/useImage';
import useViewDispatch from '../../hooks/useViewDispatch';
import { OPEN_MODAL } from '../../state/view/ViewActionTypes';
import isColor from '../../utils/isColor';

function MorphologyTool() {
  const viewDispatch = useViewDispatch();

  const currentTab = useCurrentTab();

  const { pipelined } = useImage();

  const morphologyItem: ToolbarItemProps = {
    id: 'morphology',
    icon: <FaRecordVinyl />,
    tooltip: 'Morphology',
  };

  const morphOptions = useMemo(
    () => [
      { label: 'Dilate', data: 'dilate', type: 'option' },
      { label: 'Erode', data: 'erode', type: 'option' },
      { label: 'Open', data: 'open', type: 'option' },
      { label: 'Close', data: 'close', type: 'option' },
    ],
    [],
  );

  const content = (
    <Menu>
      {morphOptions.map((option) => (
        <MenuItem
          key={option.label}
          text={option.label}
          onClick={() => selectOption(option)}
        />
      ))}
    </Menu>
  );

  const selectOption = useCallback(
    (selected) => {
      if (selected.data === undefined) return;
      viewDispatch({
        type: OPEN_MODAL,
        payload: selected.data,
      });
    },
    [viewDispatch],
  );

  if (currentTab === undefined) return null;
  if (pipelined === undefined) return null;
  if (isColor(pipelined)) return null;

  return <Toolbar.PopoverItem content={content} itemProps={morphologyItem} />;
}

export default memo(MorphologyTool);
