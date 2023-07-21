import { memo, useCallback, useMemo } from 'react';
import { FaRecordVinyl } from 'react-icons/fa';
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
import isColor from '../../utils/isColor';

function MorphologyTool() {
  const viewDispatch = useViewDispatch();

  const currentTab = useCurrentTab();

  const { pipelined } = useImage();

  const morphOptions = useMemo<MenuOptions<string>>(
    () => [
      {
        label: 'Dilate',
        data: 'dilate',
        type: 'option',
      },
      {
        label: 'Erode',
        data: 'erode',
        type: 'option',
      },
      {
        label: 'Open',
        data: 'open',
        type: 'option',
      },
      {
        label: 'Close',
        data: 'close',
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
  if (isColor(pipelined)) return null;

  return (
    <DropdownMenu
      trigger="click"
      onSelect={selectOption}
      options={morphOptions}
    >
      <Toolbar.Item title="Morphology">
        <FaRecordVinyl />
      </Toolbar.Item>
    </DropdownMenu>
  );
}

export default memo(MorphologyTool);