import styled from '@emotion/styled';
import { fromMask, GetRoisOptions, Image, RoiKind } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';
import {
  Button,
  Field,
  Input,
  Modal,
  Select,
  useToggleAccordion,
} from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import useDataDispatch from '../../hooks/useDataDispatch';
import useImage from '../../hooks/useImage';
import useModal from '../../hooks/useModal';
import { SET_ROI } from '../../state/data/DataActionTypes';
import { buttons } from '../../utils/colors';
import isBinary from '../../utils/isBinary';

import StyledModalBody from './utils/StyledModalBody';
import StyledModalHeader from './utils/StyledModalHeader';

const ExtractROIStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;

  .container {
    padding: 20px;
  }
`;

const FooterStyled = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const defaultFormContent = {
  minSurface: undefined,
  maxSurface: undefined,
  kind: undefined,
};

function ExtractROIModal() {
  const currentTab = useCurrentTab();
  const { pipelined } = useImage();
  const dataDispatch = useDataDispatch();
  const { isOpen, close } = useModal('extractROI');
  const { open: openAccordion } = useToggleAccordion();
  const [formContent, setFormContent] =
    useState<GetRoisOptions>(defaultFormContent);
  const extract = useCallback(() => {
    if (pipelined instanceof Image) return;
    const roiMapManager = fromMask(pipelined);
    dataDispatch({
      type: SET_ROI,
      payload: {
        identifier: currentTab || '',
        rois: roiMapManager.getRois(formContent),
      },
    });
    setFormContent(defaultFormContent);
    close();
    openAccordion('ROIs');
  }, [close, currentTab, dataDispatch, formContent, openAccordion, pipelined]);

  const kindOptions = useMemo(
    () => [
      [
        { label: 'White', value: RoiKind.WHITE },
        { label: 'Black', value: RoiKind.BLACK },
        { label: 'Both', value: RoiKind.BW },
      ],
    ],
    [],
  );

  if (currentTab === undefined) return null;
  if (pipelined === undefined) return null;
  if (!isBinary(pipelined)) return null;

  return (
    <Modal isOpen={isOpen} onRequestClose={close} hasCloseButton>
      <ExtractROIStyle>
        <StyledModalHeader>
          <Modal.Header>Extract ROIs</Modal.Header>
        </StyledModalHeader>
        <Modal.Body>
          <StyledModalBody>
            <FormContent>
              <Field name="minSurface" label="Minimum surface">
                <Input
                  type="number"
                  value={formContent.minSurface}
                  onChange={(event) => {
                    const newValue = event.target.valueAsNumber;
                    setFormContent({
                      ...formContent,
                      minSurface: Number.isNaN(newValue) ? undefined : newValue,
                    });
                  }}
                />
              </Field>
              <Field name="maxSurface" label="Maximum surface">
                <Input
                  type="number"
                  value={formContent.maxSurface}
                  onChange={(event) => {
                    const newValue = event.target.valueAsNumber;
                    setFormContent({
                      ...formContent,
                      maxSurface: Number.isNaN(newValue) ? undefined : newValue,
                    });
                  }}
                />
              </Field>
              <Field name="kind" label="Kind">
                <Select
                  value={formContent.kind}
                  options={kindOptions}
                  onSelect={(value) =>
                    setFormContent({ ...formContent, kind: value as RoiKind })
                  }
                />
              </Field>
            </FormContent>
          </StyledModalBody>
        </Modal.Body>
        <Modal.Footer>
          <FooterStyled>
            <Button backgroundColor={buttons.info} onClick={extract}>
              Extract
            </Button>
          </FooterStyled>
        </Modal.Footer>
      </ExtractROIStyle>
    </Modal>
  );
}

export default memo(ExtractROIModal);
