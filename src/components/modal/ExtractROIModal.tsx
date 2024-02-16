import {
  Dialog,
  DialogBody,
  DialogFooter,
  InputGroup,
  MenuItem,
} from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import styled from '@emotion/styled';
import { fromMask, GetRoisOptions, Image, RoiKind } from 'image-js';
import { memo, useCallback, useMemo, useState } from 'react';
import { Button, useToggleAccordion } from 'react-science/ui';

import useDataDispatch from '../../hooks/useDataDispatch';
import useImage from '../../hooks/useImage';
import useModal from '../../hooks/useModal';
import { SET_ROI } from '../../state/data/DataActionTypes';
import isBinary from '../../utils/isBinary';

import StyledModalBody from './utils/StyledModalBody';

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

interface ExtractROIProps {
  identifier: string;
}

function ExtractROIModal({ identifier }: ExtractROIProps) {
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
        identifier,
        rois: roiMapManager.getRois(formContent),
      },
    });
    setFormContent(defaultFormContent);
    close();
    openAccordion('ROIs');
  }, [close, identifier, dataDispatch, formContent, openAccordion, pipelined]);

  const kindOptions = useMemo(
    () => [
      { label: 'White', value: RoiKind.WHITE },
      { label: 'Black', value: RoiKind.BLACK },
      { label: 'Both', value: RoiKind.BW },
    ],
    [],
  );

  if (pipelined === undefined) return null;
  if (!isBinary(pipelined)) return null;

  return (
    <Dialog title="Extract ROIs" isOpen={isOpen} onClose={close}>
      <ExtractROIStyle>
        <DialogBody>
          <StyledModalBody>
            <FormContent>
              <InputGroup
                type="number"
                value={formContent.minSurface?.toString()}
                onChange={(event) => {
                  const newValue = event.target.valueAsNumber;
                  setFormContent({
                    ...formContent,
                    minSurface: Number.isNaN(newValue) ? undefined : newValue,
                  });
                }}
              />
              <InputGroup
                type="number"
                value={formContent.maxSurface?.toString()}
                onChange={(event) => {
                  const newValue = event.target.valueAsNumber;
                  setFormContent({
                    ...formContent,
                    maxSurface: Number.isNaN(newValue) ? undefined : newValue,
                  });
                }}
              />
              <Select
                activeItem={kindOptions.find(
                  (kind) => kind.value === formContent.kind,
                )}
                items={kindOptions}
                itemRenderer={(item, { handleClick, modifiers }) => (
                  <MenuItem
                    key={item.value}
                    text={item.label}
                    onClick={handleClick}
                    active={modifiers.active}
                    disabled={modifiers.disabled}
                    selected={item.value === formContent.kind}
                  />
                )}
                onItemSelect={(item) =>
                  setFormContent({
                    ...formContent,
                    kind: item.value,
                  })
                }
              />
            </FormContent>
          </StyledModalBody>
        </DialogBody>
        <DialogFooter>
          <FooterStyled>
            <Button intent="primary" onClick={extract}>
              Extract
            </Button>
          </FooterStyled>
        </DialogFooter>
      </ExtractROIStyle>
    </Dialog>
  );
}

export default memo(ExtractROIModal);
