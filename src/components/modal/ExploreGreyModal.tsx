import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { GreyAlgorithm } from 'image-js';
import { memo, useMemo } from 'react';
import { Modal } from 'react-science/ui';

import useData from '../../hooks/useData';
import ImageViewer from '../ImageViewer';

import StyledModalBody from './utils/StyledModalBody';
import StyledModalHeader from './utils/StyledModalHeader';

const modalStyle = css`
  display: flex;
  flex-direction: column;
  width: 75vw;
  max-height: 75vh;
`;

interface ExportGreyModalProps {
  isOpenDialog: boolean;
  closeDialog: () => void;
  previewImageIdentifier: string;
}

const ImageViewerContainer = styled.div`
  width: 40%;
  border: 1px solid #9e9e9e;
  border-radius: 4px;
`;

function ExploreGreyModal({
  isOpenDialog,
  closeDialog,
  previewImageIdentifier,
}: ExportGreyModalProps) {
  const data = useData();

  const currentAlgorithm = useMemo(() => {
    return GreyAlgorithm.AVERAGE;
  }, []);

  const image = useMemo(
    () => data.files[previewImageIdentifier]?.image,
    [data.files, previewImageIdentifier],
  );

  const greyImage = useMemo(
    () =>
      image.grey({
        algorithm: currentAlgorithm,
      }),
    [currentAlgorithm, image],
  );

  return (
    <Modal isOpen={isOpenDialog} onRequestClose={closeDialog} hasCloseButton>
      <div css={modalStyle}>
        <StyledModalHeader>
          <Modal.Header>Explore grey filters</Modal.Header>
        </StyledModalHeader>
        <Modal.Body>
          <StyledModalBody>
            <ImageViewerContainer>
              <ImageViewer identifier="__grey_filter_preview" image={image} />
            </ImageViewerContainer>
            <div style={{ width: '20%' }}>
              <p>Selector here</p>
            </div>
            <ImageViewerContainer>
              <ImageViewer
                identifier="__grey_filter_preview"
                image={greyImage}
              />
            </ImageViewerContainer>
          </StyledModalBody>
        </Modal.Body>
        <Modal.Footer>I am the footer</Modal.Footer>
      </div>
    </Modal>
  );
}

export default memo(ExploreGreyModal);
