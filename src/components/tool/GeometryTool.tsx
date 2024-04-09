import { Menu, MenuItem } from '@blueprintjs/core';
import { memo, useCallback, useMemo } from 'react';
import { TbGeometry } from 'react-icons/tb';
import { Toolbar, ToolbarItemProps } from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import useImage from '../../hooks/useImage';
import useViewDispatch from '../../hooks/useViewDispatch';
import { OPEN_MODAL } from '../../state/view/ViewActionTypes';
import isBinary from '../../utils/isBinary';

function GeometryTool() {
  const viewDispatch = useViewDispatch();

  const currentTab = useCurrentTab();

  const { pipelined } = useImage();

  const geometryItem: ToolbarItemProps = {
    id: 'geometry',
    icon: <TbGeometry />,
    tooltip: 'Geometry',
  };

  const geometryOptions = useMemo(
    () => [
      {
        label: 'Resize',
        data: 'resize',
        type: 'option',
      },
      {
        label: 'Rotate',
        data: 'rotate',
        type: 'option',
      },
    ],
    [],
  );

  const content = (
    <Menu>
      {geometryOptions.map((option) => (
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
  if (isBinary(pipelined)) return null;

  return <Toolbar.PopoverItem content={content} itemProps={geometryItem} />;
}

export default memo(GeometryTool);
