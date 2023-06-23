import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Image, Mask } from 'image-js';
import { memo, ReactNode } from 'react';
import { Button, Modal } from 'react-science/ui';

import useImage from '../../hooks/useImage';
import { buttons } from '../../utils/colors';
import ImageViewer from '../ImageViewer';

import StyledModalBody from './utils/StyledModalBody';
import StyledModalHeader from './utils/StyledModalHeader';

const modalStyle = css`
  display: flex;
  flex-direction: column;
  width: 75vw;
  max-height: 75vh;
  height: 75vh;
`;

interface FilterModalProps {
  isOpenDialog: boolean;
  closeDialog: () => void;
  previewImageIdentifier: string;
  children?: ReactNode;
  title: string;
  viewIdentifier: string;
  apply: () => void;
  previewed: Image | Mask;
}

const ImageViewerContainer = styled.div`
  width: 40%;
  flex-grow: 3;
  border: 1px solid #9e9e9e;
  border-radius: 4px;
`;

const FooterStyled = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

function FilterModal({
  isOpenDialog,
  closeDialog,
  previewImageIdentifier,
  children = null,
  title,
  viewIdentifier,
  apply,
  previewed,
}: FilterModalProps) {
  const { pipelined } = useImage(previewImageIdentifier);

  return (
    <Modal isOpen={isOpenDialog} onRequestClose={closeDialog} hasCloseButton>
      <div css={modalStyle}>
        <StyledModalHeader>
          <Modal.Header>{title}</Modal.Header>
        </StyledModalHeader>
        <Modal.Body>
          <StyledModalBody>
            <ImageViewerContainer>
              <ImageViewer identifier={viewIdentifier} image={pipelined} />
            </ImageViewerContainer>
            <div
              style={{
                flexGrow: 1,
                paddingInline: '20px',
              }}
            >
              {children}
            </div>
            <ImageViewerContainer>
              <ImageViewer identifier={viewIdentifier} image={previewed} />
            </ImageViewerContainer>
          </StyledModalBody>
        </Modal.Body>
        <Modal.Footer>
          <FooterStyled>
            <Button backgroundColor={buttons.info} onClick={apply}>
              Add filter
            </Button>
          </FooterStyled>
        </Modal.Footer>
      </div>
    </Modal>
  );
}

export default memo(FilterModal);
