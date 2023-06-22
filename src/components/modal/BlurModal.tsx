import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { BlurOptions, BorderType, Image } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';
import { Button, Field, Input, Modal, Select } from 'react-science/ui';

import useDataDispatch from '../../hooks/useDataDispatch';
import useImage from '../../hooks/useImage';
import { ADD_BLUR } from '../../state/data/DataActionTypes';
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

function BlurModal({
  isOpenDialog,
  closeDialog,
  previewImageIdentifier,
}: ExportGreyModalProps) {
  const { pipelined } = useImage(previewImageIdentifier);

  const [blurOptions, setBlurOptions] = useState<BlurOptions>({
    width: 1,
    height: 1,
    borderType: BorderType.REFLECT_101,
    borderValue: undefined,
  });

  const blurredImage = useMemo(() => {
    if (blurOptions.width % 2 !== 1 || blurOptions.height % 2 !== 1) {
      return pipelined;
    }

    if (pipelined instanceof Image) {
      return pipelined.blur(blurOptions);
    }

    return pipelined;
  }, [blurOptions, pipelined]);

  const dataDispatch = useDataDispatch();

  const addBlurFilter = useCallback(() => {
    dataDispatch({
      type: ADD_BLUR,
      payload: {
        identifier: previewImageIdentifier,
        options: blurOptions,
      },
    });
    closeDialog();
  }, [blurOptions, closeDialog, dataDispatch, previewImageIdentifier]);

  const borderTypeOptions = useMemo(
    () => [
      Object.keys(BorderType).map((borderType) => ({
        label: BorderType[borderType],
        value: BorderType[borderType],
      })),
    ],
    [],
  );

  return (
    <Modal isOpen={isOpenDialog} onRequestClose={closeDialog} hasCloseButton>
      <div css={modalStyle}>
        <StyledModalHeader>
          <Modal.Header>Blur image</Modal.Header>
        </StyledModalHeader>
        <Modal.Body>
          <StyledModalBody>
            <ImageViewerContainer>
              <ImageViewer
                identifier="__grey_filter_preview"
                image={pipelined}
              />
            </ImageViewerContainer>
            <div
              style={{
                width: '25%',
                paddingInline: '20px',
              }}
            >
              <Field name="kernelWidth" label="Kernel width">
                <Input
                  type="number"
                  name="kernelWidth"
                  step={2}
                  min={1}
                  value={blurOptions.width}
                  onChange={(e) => {
                    setBlurOptions({
                      ...blurOptions,
                      width: Number(e.target.value),
                    });
                  }}
                />
              </Field>
              <Field name="kernelHeight" label="Kenel height">
                <Input
                  type="number"
                  name="kernelHeight"
                  step={2}
                  min={1}
                  value={blurOptions.height}
                  onChange={(e) => {
                    setBlurOptions({
                      ...blurOptions,
                      height: Number(e.target.value),
                    });
                  }}
                />
              </Field>

              <Field name="borderType" label="Border type">
                <Select
                  value={blurOptions.borderType}
                  options={borderTypeOptions}
                  onSelect={(value) => {
                    setBlurOptions({
                      ...blurOptions,
                      borderType: value as BorderType,
                    });
                  }}
                />
              </Field>

              {blurOptions.borderType === BorderType.CONSTANT && (
                <Field name="borderValue" label="Border value">
                  <Input
                    type="number"
                    name="borderValue"
                    value={blurOptions.borderValue}
                    onChange={(e) => {
                      setBlurOptions({
                        ...blurOptions,
                        borderValue: Number(e.target.value),
                      });
                    }}
                  />
                </Field>
              )}
            </div>
            <ImageViewerContainer>
              <ImageViewer
                identifier="__grey_filter_preview"
                image={blurredImage}
              />
            </ImageViewerContainer>
          </StyledModalBody>
        </Modal.Body>
        <Modal.Footer>
          <FooterStyled>
            <Button backgroundColor={buttons.info} onClick={addBlurFilter}>
              Add filter
            </Button>
          </FooterStyled>
        </Modal.Footer>
      </div>
    </Modal>
  );
}

export default memo(BlurModal);
