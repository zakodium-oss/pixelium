import styled from '@emotion/styled';
import { Image, Mask } from 'image-js';
import { memo, ReactNode, useCallback } from 'react';
import { Button, Modal } from 'react-science/ui';

import useViewDispatch from '../../../hooks/useViewDispatch';
import { SET_EDIT_MODE_IDENTIFIER } from '../../../state/view/ViewActionTypes';
import { buttons } from '../../../utils/colors';
import ImageViewer from '../../ImageViewer';
import StyledModalBody from '../utils/StyledModalBody';
import StyledModalHeader from '../utils/StyledModalHeader';

const PreviewModalStyle = styled.div`
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
  algoError?: string | undefined;
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

const CenterColumn = styled.div`
  flex-grow: 1;
  padding-inline: 20px;
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
  algoError = undefined,
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
      <PreviewModalStyle>
        <StyledModalHeader>
          <Modal.Header>{editing ? `Editing : ${title}` : title}</Modal.Header>
        </StyledModalHeader>
        <Modal.Body>
          <StyledModalBody>
            <ImageViewerContainer>
              <ImageViewer identifier={viewIdentifier} image={original} />
            </ImageViewerContainer>
            <CenterColumn>{children}</CenterColumn>
            <ImageViewerContainer>
              {preview === null ? (
                <AlgorithmError>
                  Error running algorithm
                  {algoError ? `: ${algoError}` : algoError}
                </AlgorithmError>
              ) : (
                <ImageViewer identifier={viewIdentifier} image={preview} />
              )}
            </ImageViewerContainer>
          </StyledModalBody>
        </Modal.Body>
        <Modal.Footer>
          <FooterStyled>
            <Button backgroundColor={buttons.info} onClick={internalApply}>
              {editing ? 'Edit operation' : 'Add operation'}
            </Button>
          </FooterStyled>
        </Modal.Footer>
      </PreviewModalStyle>
    </Modal>
  );
}

export default memo(PreviewModal);
