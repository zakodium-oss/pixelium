import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Image, Mask } from 'image-js';
import { memo, ReactNode, useCallback } from 'react';
import { Button, Modal } from 'react-science/ui';

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
  children?: ReactNode;
  title: string;
  viewIdentifier: string;
  apply: () => void;
  original: Image | Mask;
  preview: Image | Mask | null;
  editing: boolean;
}

const ImageViewerContainer = styled.div`
  width: 30%;
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
  children = null,
  title,
  viewIdentifier,
  apply,
  original,
  preview,
  editing,
}: PreviewModalProps) {
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
              <ImageViewer identifier={viewIdentifier} image={original} />
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
              {preview === null ? (
                <AlgorithmError>Error running algorithm</AlgorithmError>
              ) : (
                <ImageViewer identifier={viewIdentifier} image={preview} />
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
