import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { GreyAlgorithm, Image } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';
import { Button, Modal } from 'react-science/ui';

import useDataDispatch from '../../hooks/useDataDispatch';
import useImage from '../../hooks/useImage';
import { ADD_GREY_FILTER } from '../../state/data/DataActionTypes';
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

function ExploreGreyModal({
  isOpenDialog,
  closeDialog,
  previewImageIdentifier,
}: ExportGreyModalProps) {
  const { pipelined } = useImage(previewImageIdentifier);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<
    GreyAlgorithm | undefined
  >(GreyAlgorithm.LUMA_709);

  const greyImage = useMemo(
    () =>
      pipelined instanceof Image
        ? pipelined.grey({
            algorithm: selectedAlgorithm,
          })
        : pipelined,
    [selectedAlgorithm, pipelined],
  );

  const dataDispatch = useDataDispatch();

  const addGreyFilter = useCallback(() => {
    dataDispatch({
      type: ADD_GREY_FILTER,
      payload: {
        identifier: previewImageIdentifier,
        options: {
          algorithm: selectedAlgorithm,
        },
      },
    });
    closeDialog();
  }, [closeDialog, dataDispatch, previewImageIdentifier, selectedAlgorithm]);

  return (
    <Modal isOpen={isOpenDialog} onRequestClose={closeDialog} hasCloseButton>
      <div css={modalStyle}>
        <StyledModalHeader>
          <Modal.Header>Explore grey filters</Modal.Header>
        </StyledModalHeader>
        <Modal.Body>
          <StyledModalBody>
            <ImageViewerContainer>
              <ImageViewer
                identifier="__grey_filter_preview"
                image={pipelined}
              />
            </ImageViewerContainer>
            <div style={{ width: '20%', paddingInline: '20px' }}>
              <FastSelector
                options={Object.values(GreyAlgorithm)}
                selected={selectedAlgorithm}
                setSelected={setSelectedAlgorithm}
              />
            </div>
            <ImageViewerContainer>
              <ImageViewer
                identifier="__grey_filter_preview"
                image={greyImage}
              />
            </ImageViewerContainer>
          </StyledModalBody>
        </Modal.Body>
        <Modal.Footer>
          <FooterStyled>
            <Button backgroundColor={buttons.info} onClick={addGreyFilter}>
              Add filter
            </Button>
          </FooterStyled>
        </Modal.Footer>
      </div>
    </Modal>
  );
}

export default memo(ExploreGreyModal);
