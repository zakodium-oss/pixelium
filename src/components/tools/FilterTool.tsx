import { memo, useCallback, useMemo } from 'react';
import { FaFilter } from 'react-icons/fa';
import {
  DropdownMenu,
  MenuOption,
  MenuOptions,
  Toolbar,
  useOnOff,
} from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import useImage from '../../hooks/useImage';
import isBinary from '../../utils/isBinary';
import isColor from '../../utils/isColor';
import BlurModal from '../modal/BlurModal';
import ExploreGreyModal from '../modal/ExploreGreyModal';

function FilterTool() {
  const [isGreyDialogOpen, openGreyDialog, closeGreyDialog] = useOnOff(false);
  const [isBlurDialogOpen, openBlurDialog, closeBlurDialog] = useOnOff(false);
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
    ],
    [pipelined],
  );

  const selectOption = useCallback(
    (selected: MenuOption<string>) => {
      if (selected.data === 'grey') {
        openGreyDialog();
      }
      if (selected.data === 'blur') {
        openBlurDialog();
      }
    },
    [openBlurDialog, openGreyDialog],
  );

  if (currentTab === undefined) return null;
  if (pipelined === undefined) return null;

  return (
    <>
      <DropdownMenu
        trigger="click"
        onSelect={selectOption}
        options={filterOptions}
      >
        <Toolbar.Item title="Filters">
          <FaFilter />
        </Toolbar.Item>
      </DropdownMenu>
      {isGreyDialogOpen && (
        <ExploreGreyModal
          isOpenDialog={isGreyDialogOpen}
          closeDialog={closeGreyDialog}
          previewImageIdentifier={currentTab}
        />
      )}
      {isBlurDialogOpen && (
        <BlurModal
          isOpenDialog={isBlurDialogOpen}
          closeDialog={closeBlurDialog}
          previewImageIdentifier={currentTab}
        />
      )}
    </>
  );
}

export default memo(FilterTool);
