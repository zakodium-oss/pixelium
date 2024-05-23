import { memo } from 'react';

import useCurrentTab from '../../hooks/useCurrentTab';
import useView from '../../hooks/useView';

import AboutModal from './AboutModal';
import ExportModal from './ExportModal';
import ExtractROIModal from './ExtractROIModal';
import LogModal from './LogModal';
import BlurModal from './preview/filters/BlurModal';
import ConvertModal from './preview/filters/ConvertModal';
import ExploreGreyModal from './preview/filters/ExploreGreyModal';
import FlipModal from './preview/filters/FlipModal';
import GaussianBlurModal from './preview/filters/GaussianBlurModal';
import InvertModal from './preview/filters/InvertModal';
import LevelModal from './preview/filters/LevelModal';
import MedianFilterModal from './preview/filters/MedianFilterModal';
import PixelateModal from './preview/filters/PixelateModal';
import ResizeModal from './preview/geometry/ResizeModal';
import RotateModal from './preview/geometry/RotateModal';
import ExploreMaskModal from './preview/mask/ExploreMaskModal';
import CloseModal from './preview/morphology/CloseModal';
import DilateModal from './preview/morphology/DilateModal';
import ErodeModal from './preview/morphology/ErodeModal';
import OpenModal from './preview/morphology/OpenModal';

function ModalContainer() {
  const view = useView();
  const currentTab = useCurrentTab();

  return (
    <>
      {currentTab !== undefined && (
        <>
          {view.modals.mask && (
            <ExploreMaskModal previewImageIdentifier={currentTab} />
          )}
          {view.modals.grey && (
            <ExploreGreyModal previewImageIdentifier={currentTab} />
          )}
          {view.modals.convert && (
            <ConvertModal previewImageIdentifier={currentTab} />
          )}
          {view.modals.blur && (
            <BlurModal previewImageIdentifier={currentTab} />
          )}
          {view.modals.gaussianBlur && (
            <GaussianBlurModal previewImageIdentifier={currentTab} />
          )}
          {view.modals.invert && (
            <InvertModal previewImageIdentifier={currentTab} />
          )}
          {view.modals.flip && (
            <FlipModal previewImageIdentifier={currentTab} />
          )}
          {view.modals.level && (
            <LevelModal previewImageIdentifier={currentTab} />
          )}
          {view.modals.pixelate && (
            <PixelateModal previewImageIdentifier={currentTab} />
          )}
          {view.modals.median && (
            <MedianFilterModal previewImageIdentifier={currentTab} />
          )}
          {view.modals.dilate && (
            <DilateModal previewImageIdentifier={currentTab} />
          )}
          {view.modals.erode && (
            <ErodeModal previewImageIdentifier={currentTab} />
          )}
          {view.modals.open && (
            <OpenModal previewImageIdentifier={currentTab} />
          )}
          {view.modals.close && (
            <CloseModal previewImageIdentifier={currentTab} />
          )}
          {view.modals.export && <ExportModal />}
          {view.modals.resize && (
            <ResizeModal previewImageIdentifier={currentTab} />
          )}
          {view.modals.rotate && (
            <RotateModal previewImageIdentifier={currentTab} />
          )}
          {view.modals.extractROI && (
            <ExtractROIModal identifier={currentTab} />
          )}
        </>
      )}
      {view.modals.log && <LogModal />}
      {view.modals.about && <AboutModal />}
    </>
  );
}

export default memo(ModalContainer);
