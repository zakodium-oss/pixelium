import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { memo, useCallback, useMemo } from 'react';
import { Button, Modal } from 'react-science/ui';

import useDataDispatch from '../../hooks/useDataDispatch';
import useImage from '../../hooks/useImage';
import { ADD_INVERT } from '../../state/data/DataActionTypes';
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

interface InvertModalProps {
  isOpenDialog: boolean;
  closeDialog: () => void;
  previewImageIdentifier: string;
}

const ImageViewerContainer = styled.div`
  width: 40%;
  border: 1px solid #9e9e9e;
  border-radius: 4px;
`;

const FooterStyled = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const viewIdentifier = '__invert_preview';

function InvertModal({
  isOpenDialog,
  closeDialog,
  previewImageIdentifier,
}: InvertModalProps) {
  const { pipelined } = useImage(previewImageIdentifier);

  const invertedImage = useMemo(() => pipelined.invert(), [pipelined]);

  const dataDispatch = useDataDispatch();

  const addInvertFilter = useCallback(() => {
    dataDispatch({
      type: ADD_INVERT,
      payload: {
        identifier: previewImageIdentifier,
      },
    });
    closeDialog();
  }, [closeDialog, dataDispatch, previewImageIdentifier]);

  return (
    <Modal isOpen={isOpenDialog} onRequestClose={closeDialog} hasCloseButton>
      <div css={modalStyle}>
        <StyledModalHeader>
          <Modal.Header>Invert image</Modal.Header>
        </StyledModalHeader>
        <Modal.Body>
          <StyledModalBody>
            <ImageViewerContainer>
              <ImageViewer identifier={viewIdentifier} image={pipelined} />
            </ImageViewerContainer>
            <div
              style={{
                width: '25%',
                paddingInline: '20px',
              }}
            />
            <ImageViewerContainer>
              <ImageViewer identifier={viewIdentifier} image={invertedImage} />
            </ImageViewerContainer>
          </StyledModalBody>
        </Modal.Body>
        <Modal.Footer>
          <FooterStyled>
            <Button backgroundColor={buttons.info} onClick={addInvertFilter}>
              Add filter
            </Button>
          </FooterStyled>
        </Modal.Footer>
      </div>
    </Modal>
  );
}

export default memo(InvertModal);
