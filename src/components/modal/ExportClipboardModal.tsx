import { Checkbox, Dialog, DialogBody, DialogFooter } from '@blueprintjs/core';
import styled from '@emotion/styled';
import { memo, useCallback, useMemo, useState } from 'react';
import { Button } from 'react-science/ui';

import useLog from '../../hooks/useLog';
import useModal from '../../hooks/useModal';
import { saveToClipboard } from '../../utils/export';
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

function ExportClipboardModal() {
  const { isOpen, close } = useModal('exportClipboard');
  const { logger } = useLog();

  const defaultFormState = useMemo(
    () => ({
      annotations: true,
    }),
    [],
  );

  const [formState, setFormState] = useState(defaultFormState);
  const resetForm = useCallback(
    () => setFormState(defaultFormState),
    [setFormState, defaultFormState],
  );

  const mergeToImage = useMergeToImage();

  const copyToClipboard = useCallback(() => {
    return mergeToImage().then((toSave) => saveToClipboard(toSave));
  }, [mergeToImage]);

  const save = useCallback(() => {
    copyToClipboard()
      .catch((error) => logger.error(`Failed to copy to clipboard: ${error}`))
      .finally(() => {
        resetForm();
        close();
      });
  }, [close, copyToClipboard, logger, resetForm]);

  return (
    <Dialog
      title="Copy to clipboard"
      isOpen={isOpen}
      onClose={close}
      style={{ width: 'fit-content' }}
    >
      <ExportStyle>
        <DialogBody>
          <StyledModalBody>
            <div>
              <Checkbox
                label="Include annotations"
                alignIndicator="right"
                checked={formState.annotations}
                onChange={(e) =>
                  setFormState({ ...formState, annotations: e.target.checked })
                }
              />
            </div>
          </StyledModalBody>
        </DialogBody>
        <DialogFooter
          minimal
          actions={
            <Button intent="primary" onClick={save}>
              <SaveButtonInner>Copy</SaveButtonInner>
            </Button>
          }
        />
      </ExportStyle>
    </Dialog>
  );
}

export default memo(ExportClipboardModal);
