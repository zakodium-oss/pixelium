import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { FlipOptions, Image } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';
import { Button, Field, Modal, Select } from 'react-science/ui';

import useDataDispatch from '../../hooks/useDataDispatch';
import useImage from '../../hooks/useImage';
import { ADD_FLIP } from '../../state/data/DataActionTypes';
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

interface FlipModalProps {
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

const viewIdentifier = '__flip_preview';

function FlipModal({
  isOpenDialog,
  closeDialog,
  previewImageIdentifier,
}: FlipModalProps) {
  const { pipelined } = useImage(previewImageIdentifier);

  const dataDispatch = useDataDispatch();

  const [options, setOptions] = useState<FlipOptions>({
    axis: 'horizontal',
  });
  const axisOptions = useMemo(
    () => [
      [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' },
        { label: 'Both', value: 'both' },
      ],
    ],
    [],
  );

  const flippedImage = useMemo(
    () => (pipelined instanceof Image ? pipelined.flip(options) : pipelined),
    [options, pipelined],
  );

  const addFlipFilter = useCallback(() => {
    dataDispatch({
      type: ADD_FLIP,
      payload: {
        identifier: previewImageIdentifier,
        options,
      },
    });
    closeDialog();
  }, [closeDialog, dataDispatch, options, previewImageIdentifier]);

  return (
    <Modal isOpen={isOpenDialog} onRequestClose={closeDialog} hasCloseButton>
      <div css={modalStyle}>
        <StyledModalHeader>
          <Modal.Header>Flip image</Modal.Header>
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
              <Field name="axis" label="Axis">
                <Select
                  value={options.axis}
                  options={axisOptions}
                  onSelect={(value) =>
                    setOptions({
                      axis: value as
                        | 'horizontal'
                        | 'vertical'
                        | 'both'
                        | undefined,
                    })
                  }
                />
              </Field>
            </div>
            <ImageViewerContainer>
              <ImageViewer identifier={viewIdentifier} image={flippedImage} />
            </ImageViewerContainer>
          </StyledModalBody>
        </Modal.Body>
        <Modal.Footer>
          <FooterStyled>
            <Button backgroundColor={buttons.info} onClick={addFlipFilter}>
              Add filter
            </Button>
          </FooterStyled>
        </Modal.Footer>
      </div>
    </Modal>
  );
}

export default memo(FlipModal);
