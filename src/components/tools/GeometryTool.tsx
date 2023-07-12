import { memo, useCallback, useMemo } from 'react';
import { TbGeometry } from 'react-icons/tb';
import {
  DropdownMenu,
  MenuOption,
  MenuOptions,
  Toolbar,
} from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import useImage from '../../hooks/useImage';
import useViewDispatch from '../../hooks/useViewDispatch';
import { OPEN_MODAL } from '../../state/view/ViewActionTypes';
import isBinary from '../../utils/isBinary';

function GeometryTool() {
  const viewDispatch = useViewDispatch();

  const currentTab = useCurrentTab();

  const { pipelined } = useImage();

  const geometryOptions = useMemo<MenuOptions<string>>(
    () => [
      {
        label: 'Resize',
        data: 'resize',
        type: 'option',
      },
    ],
    [],
  );

  const selectOption = useCallback(
    (selected: MenuOption<string>) => {
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

  return (
    <DropdownMenu
      trigger="click"
      onSelect={selectOption}
      options={geometryOptions}
    >
      <Toolbar.Item title="Geometry">
        <TbGeometry />
      </Toolbar.Item>
    </DropdownMenu>
  );
}

export default memo(GeometryTool);
