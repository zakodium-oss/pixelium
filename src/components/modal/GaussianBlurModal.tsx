import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { GaussianBlurXYOptions, Image } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';
import { Button, Field, Input, Modal } from 'react-science/ui';

import useDataDispatch from '../../hooks/useDataDispatch';
import useImage from '../../hooks/useImage';
import { ADD_GAUSSIAN_BLUR } from '../../state/data/DataActionTypes';
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

interface GaussianBlurModalProps {
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

const viewIdentifier = '__gaussian_blur_preview';

function BlurModal({
  isOpenDialog,
  closeDialog,
  previewImageIdentifier,
}: GaussianBlurModalProps) {
  const { pipelined } = useImage(previewImageIdentifier);

  const [gaussianBlurOptions, setGaussianBlurOptions] =
    useState<GaussianBlurXYOptions>({
      sigmaX: 1,
      sigmaY: 1,
      sizeX: 1,
      sizeY: 1,
    });

  const blurredImage = useMemo(() => {
    if (
      (gaussianBlurOptions.sizeX || 1) % 2 !== 1 ||
      (gaussianBlurOptions.sizeY || 1) % 2 !== 1
    ) {
      return pipelined;
    }

    if (pipelined instanceof Image) {
      return pipelined.gaussianBlur(gaussianBlurOptions);
    }

    return pipelined;
  }, [gaussianBlurOptions, pipelined]);

  const dataDispatch = useDataDispatch();

  const addGaussianBlurFilter = useCallback(() => {
    dataDispatch({
      type: ADD_GAUSSIAN_BLUR,
      payload: {
        identifier: previewImageIdentifier,
        options: gaussianBlurOptions,
      },
    });
    closeDialog();
  }, [gaussianBlurOptions, closeDialog, dataDispatch, previewImageIdentifier]);

  return (
    <Modal isOpen={isOpenDialog} onRequestClose={closeDialog} hasCloseButton>
      <div css={modalStyle}>
        <StyledModalHeader>
          <Modal.Header>Gaussian blur image</Modal.Header>
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
            >
              <Field name="sigmaX" label="Sigma X">
                <Input
                  type="number"
                  name="sigmaX"
                  value={gaussianBlurOptions.sigmaX}
                  onChange={(e) => {
                    setGaussianBlurOptions({
                      ...gaussianBlurOptions,
                      sigmaX: Number(e.target.value),
                    });
                  }}
                />
              </Field>
              <Field name="sigmaY" label="Sigma Y">
                <Input
                  type="number"
                  name="sigmaY"
                  value={gaussianBlurOptions.sigmaY}
                  onChange={(e) => {
                    setGaussianBlurOptions({
                      ...gaussianBlurOptions,
                      sigmaY: Number(e.target.value),
                    });
                  }}
                />
              </Field>
              <Field name="sizeX" label="Size X">
                <Input
                  type="number"
                  name="sizeX"
                  min={1}
                  step={2}
                  value={gaussianBlurOptions.sizeX}
                  onChange={(e) => {
                    setGaussianBlurOptions({
                      ...gaussianBlurOptions,
                      sizeX: Number(e.target.value),
                    });
                  }}
                />
              </Field>
              <Field name="sizeY" label="Size Y">
                <Input
                  type="number"
                  name="sizeY"
                  min={1}
                  step={2}
                  value={gaussianBlurOptions.sizeY}
                  onChange={(e) => {
                    setGaussianBlurOptions({
                      ...gaussianBlurOptions,
                      sizeY: Number(e.target.value),
                    });
                  }}
                />
              </Field>
            </div>
            <ImageViewerContainer>
              <ImageViewer identifier={viewIdentifier} image={blurredImage} />
            </ImageViewerContainer>
          </StyledModalBody>
        </Modal.Body>
        <Modal.Footer>
          <FooterStyled>
            <Button
              backgroundColor={buttons.info}
              onClick={() => addGaussianBlurFilter()}
            >
              Add filter
            </Button>
          </FooterStyled>
        </Modal.Footer>
      </div>
    </Modal>
  );
}

export default memo(BlurModal);
