import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Image, Mask } from 'image-js';
import { memo, ReactNode, useCallback } from 'react';
import { Button, Modal } from 'react-science/ui';

import useImage from '../../hooks/useImage';
import useViewDispatch from '../../hooks/useViewDispatch';
import { SET_EDIT_MODE_IDENTIFIER } from '../../state/view/ViewActionTypes';
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

interface PreviewModalProps {
  isOpenDialog: boolean;
  closeDialog: () => void;
  previewImageIdentifier: string;
  children?: ReactNode;
  title: string;
  viewIdentifier: string;
  apply: () => void;
  previewed: Image | Mask | null;
  editing: boolean;
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

const AlgorithmError = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  color: red;
  font-size: 1.25rem;
  font-weight: bold;
`;

function PreviewModal({
  isOpenDialog,
  closeDialog,
  previewImageIdentifier,
  children = null,
  title,
  viewIdentifier,
  apply,
  previewed,
  editing,
}: PreviewModalProps) {
  const { pipelined } = useImage(previewImageIdentifier);

  const viewDispatch = useViewDispatch();

  const internalApply = useCallback(() => {
    viewDispatch({
      type: SET_EDIT_MODE_IDENTIFIER,
      payload: null,
    });
    apply();
  }, [apply, viewDispatch]);

  return (
    <Modal isOpen={isOpenDialog} onRequestClose={closeDialog} hasCloseButton>
      <div css={modalStyle}>
        <StyledModalHeader>
          <Modal.Header>{editing ? `Editing : ${title}` : title}</Modal.Header>
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
              {previewed === null ? (
                <AlgorithmError>Error running algorithm</AlgorithmError>
              ) : (
                <ImageViewer identifier={viewIdentifier} image={previewed} />
              )}
            </ImageViewerContainer>
          </StyledModalBody>
        </Modal.Body>
        <Modal.Footer>
          <FooterStyled>
            <Button backgroundColor={buttons.info} onClick={internalApply}>
              {editing ? 'Edit filter' : 'Add filter'}
            </Button>
          </FooterStyled>
        </Modal.Footer>
      </div>
    </Modal>
  );
}

export default memo(PreviewModal);
