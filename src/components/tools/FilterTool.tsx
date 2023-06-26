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
import useView from '../../hooks/useView';
import useViewDispatch from '../../hooks/useViewDispatch';
import isBinary from '../../utils/isBinary';
import isColor from '../../utils/isColor';
import BlurModal from '../modal/filters/BlurModal';
import ExploreGreyModal from '../modal/filters/ExploreGreyModal';
import FlipModal from '../modal/filters/FlipModal';
import GaussianBlurModal from '../modal/filters/GaussianBlurModal';
import InvertModal from '../modal/filters/InvertModal';
import LevelModal from '../modal/filters/LevelModal';
import MedianFilterModal from '../modal/filters/MedianFilterModal';
import PixelateModal from '../modal/filters/PixelateModal';

function FilterTool() {
  const view = useView();
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
        type: 'OPEN_MODAL',
        payload: selected.data,
      });
    },
    [viewDispatch],
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
      {view.modals.grey && (
        <ExploreGreyModal previewImageIdentifier={currentTab} />
      )}
      {view.modals.blur && <BlurModal previewImageIdentifier={currentTab} />}
      {view.modals.gaussianBlur && (
        <GaussianBlurModal previewImageIdentifier={currentTab} />
      )}
      {view.modals.invert && (
        <InvertModal previewImageIdentifier={currentTab} />
      )}
      {view.modals.flip && <FlipModal previewImageIdentifier={currentTab} />}
      {view.modals.level && <LevelModal previewImageIdentifier={currentTab} />}
      {view.modals.pixelate && (
        <PixelateModal previewImageIdentifier={currentTab} />
      )}
      {view.modals.median && (
        <MedianFilterModal previewImageIdentifier={currentTab} />
      )}
    </>
  );
}

export default memo(FilterTool);
