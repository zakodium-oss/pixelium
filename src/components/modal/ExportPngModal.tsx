import {
  Checkbox,
  InputGroup,
  FormGroup,
  Dialog,
  DialogBody,
  DialogFooter,
} from '@blueprintjs/core';
import styled from '@emotion/styled';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from 'react-science/ui';

import useCurrentTab from '../../hooks/useCurrentTab';
import useLog from '../../hooks/useLog';
import useModal from '../../hooks/useModal';
import { saveAsPng } from '../../utils/export';
import { useMergeToImage } from '../tool/ExportTool';

import StyledModalBody from './utils/StyledModalBody';

const ExportStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;

  .header {
    font-size: 1.25rem;
  }

  .container {
    padding: 20px;
  }
`;

const SaveButtonInner = styled.span`
  display: flex;
  align-items: center;
`;

function ExportPngModal() {
  const { isOpen, close } = useModal('exportPng');
  const currentTab = useCurrentTab();
  const [hasAnnotations, setHasAnnotations] = useState<boolean | null>(null);

  const { logger } = useLog();

  const defaultFormState = useMemo(
    () => ({
      name: '',
      annotations: true,
    }),
    [],
  );

  const [formState, setFormState] = useState(defaultFormState);
  const resetForm = useCallback(
    () => setFormState(defaultFormState),
    [setFormState, defaultFormState],
  );

  const mergeToImage = useMergeToImage(formState.annotations);

  const exportPNG = useCallback(async () => {
    return mergeToImage().then(({ toSave }) =>
      saveAsPng(toSave, `${currentTab || 'unnamed'}.png`),
    );
  }, [currentTab, mergeToImage]);

  const save = useCallback(() => {
    exportPNG()
      .catch((error) => logger.error(`Failed to generate PNG: ${error}`))
      .finally(() => {
        resetForm();
        close();
      });
  }, [close, exportPNG, logger, resetForm]);

  useEffect(() => {
    mergeToImage()
      .then(({ annotations }) => {
        if (annotations !== null) {
          setHasAnnotations(true);
        } else {
          setHasAnnotations(false);
        }
      })
      .catch((error) => {
        logger.error(`Failed to merge to image: ${error}`);
      });
  }, [logger, mergeToImage]);

  if (hasAnnotations === null) {
    return null;
  }

  return (
    <Dialog
      title="Export PNG file"
      isOpen={isOpen}
      onClose={close}
      style={{ width: 'fit-content' }}
    >
      <ExportStyle>
        <DialogBody>
          <StyledModalBody>
            <div>
              <FormGroup label="Name">
                <InputGroup
                  type="text"
                  placeholder="Untitled"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      name: e.target.value,
                    })
                  }
                />
              </FormGroup>
              {hasAnnotations ? (
                <Checkbox
                  label="Include annotations"
                  alignIndicator="right"
                  checked={formState.annotations}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      annotations: e.target.checked,
                    })
                  }
                />
              ) : null}
            </div>
          </StyledModalBody>
        </DialogBody>
        <DialogFooter
          minimal
          actions={
            <Button intent="primary" onClick={save}>
              <SaveButtonInner>Save</SaveButtonInner>
            </Button>
          }
        />
      </ExportStyle>
    </Dialog>
  );
}

export default memo(ExportPngModal);
