import { memo } from 'react';

import useCurrentTab from '../../hooks/useCurrentTab';
import useView from '../../hooks/useView';

import ExploreMaskModal from './ExploreMaskModal';
import BlurModal from './filters/BlurModal';
import ExploreGreyModal from './filters/ExploreGreyModal';
import FlipModal from './filters/FlipModal';
import GaussianBlurModal from './filters/GaussianBlurModal';
import InvertModal from './filters/InvertModal';
import LevelModal from './filters/LevelModal';
import MedianFilterModal from './filters/MedianFilterModal';
import PixelateModal from './filters/PixelateModal';

function ModalContainer() {
  const view = useView();
  const currentTab = useCurrentTab();

  if (currentTab === undefined) return null;

  return (
    <>
      {view.modals.mask && (
        <ExploreMaskModal previewImageIdentifier={currentTab} />
      )}
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

export default memo(ModalContainer);
