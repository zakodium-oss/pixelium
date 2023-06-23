import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Mask, ThresholdAlgorithm } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';
import { Button, Modal } from 'react-science/ui';

import useDataDispatch from '../../hooks/useDataDispatch';
import useImage from '../../hooks/useImage';
import { ADD_MASK } from '../../state/data/DataActionTypes';
import { buttons } from '../../utils/colors';
import FastSelector from '../FastSelector';
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

const viewIdentifier = '__mask_preview';

function ExploreGreyModal({
  isOpenDialog,
  closeDialog,
  previewImageIdentifier,
}: ExportGreyModalProps) {
  const { pipelined } = useImage(previewImageIdentifier);

  const [algorithm, setAlgorithm] = useState<ThresholdAlgorithm | undefined>(
    ThresholdAlgorithm.HUANG,
  );

  const maskImage = useMemo(() => {
    if (pipelined instanceof Mask) {
      return pipelined;
    }

    try {
      return pipelined.threshold({ algorithm });
    } catch {
      return null;
    }
  }, [pipelined, algorithm]);

  const dataDispatch = useDataDispatch();

  const addMask = useCallback(() => {
    dataDispatch({
      type: ADD_MASK,
      payload: {
        identifier: previewImageIdentifier,
        options: {
          algorithm,
        },
      },
    });
    closeDialog();
  }, [closeDialog, dataDispatch, previewImageIdentifier, algorithm]);

  return (
    <Modal isOpen={isOpenDialog} onRequestClose={closeDialog} hasCloseButton>
      <div css={modalStyle}>
        <StyledModalHeader>
          <Modal.Header>Explore masks</Modal.Header>
        </StyledModalHeader>
        <Modal.Body>
          <StyledModalBody>
            <ImageViewerContainer>
              <ImageViewer identifier={viewIdentifier} image={pipelined} />
            </ImageViewerContainer>
            <div style={{ width: '20%', paddingInline: '20px' }}>
              <FastSelector
                options={Object.values(ThresholdAlgorithm)}
                selected={algorithm}
                setSelected={setAlgorithm}
              />
            </div>
            <ImageViewerContainer>
              {maskImage === null ? (
                <AlgorithmError>Error running algorithm</AlgorithmError>
              ) : (
                <ImageViewer identifier={viewIdentifier} image={maskImage} />
              )}
            </ImageViewerContainer>
          </StyledModalBody>
        </Modal.Body>
        <Modal.Footer>
          <FooterStyled>
            <Button backgroundColor={buttons.info} onClick={addMask}>
              Add filter
            </Button>
          </FooterStyled>
        </Modal.Footer>
      </div>
    </Modal>
  );
}

export default memo(ExploreGreyModal);
