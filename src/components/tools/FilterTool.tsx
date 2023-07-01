import { memo, useCallback, useMemo } from 'react';
import { FaFilter } from 'react-icons/fa';
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
import isColor from '../../utils/isColor';

function FilterTool() {
  const viewDispatch = useViewDispatch();

  const currentTab = useCurrentTab();

  const { pipelined } = useImage(currentTab || '');

  const filterOptions = useMemo<MenuOptions<string>>(
    () => [
      {
        label: 'Grey filters',
        data: 'grey',
        type: 'option',
        disabled: !isColor(pipelined),
      },
      {
        label: 'Blur',
        data: 'blur',
        type: 'option',
        disabled: isBinary(pipelined),
      },
      {
        label: 'Gaussian blur',
        data: 'gaussianBlur',
        type: 'option',
        disabled: isBinary(pipelined),
      },
      {
        label: 'Invert',
        data: 'invert',
        type: 'option',
      },
      {
        label: 'Flip',
        data: 'flip',
        type: 'option',
        disabled: isBinary(pipelined),
      },
      {
        label: 'Level',
        data: 'level',
        type: 'option',
        disabled: isBinary(pipelined),
      },
      {
        label: 'Pixelate',
        data: 'pixelate',
        type: 'option',
        disabled: isBinary(pipelined),
      },
      {
        label: 'Median filter',
        data: 'median',
        type: 'option',
        disabled: isBinary(pipelined),
      },
    ],
    [pipelined],
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

  return (
    <DropdownMenu
      trigger="click"
      onSelect={selectOption}
      options={filterOptions}
    >
      <Toolbar.Item title="Filters">
        <FaFilter />
      </Toolbar.Item>
    </DropdownMenu>
  );
}

export default memo(FilterTool);
