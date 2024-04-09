import { Menu, MenuItem } from '@blueprintjs/core';
import { memo, useCallback, useMemo } from 'react';
import { FaFilter } from 'react-icons/fa';
import { Toolbar, ToolbarItemProps } from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import useImage from '../../hooks/useImage';
import useViewDispatch from '../../hooks/useViewDispatch';
import { OPEN_MODAL } from '../../state/view/ViewActionTypes';
import isBinary from '../../utils/isBinary';
import isColor from '../../utils/isColor';

function FilterTool() {
  const viewDispatch = useViewDispatch();

  const currentTab = useCurrentTab();

  const { pipelined } = useImage();

  const filterItem: ToolbarItemProps = {
    id: 'filter',
    icon: <FaFilter />,
    tooltip: 'Filters',
  };

  const filterOptions = useMemo(
    () => [
      {
        label: 'Grey filters',
        data: 'grey',
        type: 'option',
        disabled: !isColor(pipelined),
      },
      {
        label: 'Convert color',
        data: 'convertColor',
        type: 'option',
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

  const content = (
    <Menu>
      {filterOptions.map((option) => (
        <MenuItem
          key={option.label}
          text={option.label}
          disabled={option.disabled}
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

  return <Toolbar.PopoverItem content={content} itemProps={filterItem} />;
}

export default memo(FilterTool);
