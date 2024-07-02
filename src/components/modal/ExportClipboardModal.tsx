import {
  Checkbox,
  Dialog,
  DialogBody,
  DialogFooter,
  Position,
  OverlayToaster,
} from '@blueprintjs/core';
import styled from '@emotion/styled';
import { memo, useCallback, useMemo, useState } from 'react';
import { Button } from 'react-science/ui';

import useLog from '../../hooks/useLog';
import useModal from '../../hooks/useModal';
import useOriginalFilteredROIs from '../../hooks/useOriginalFilteredROIs';
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

const AppToaster = OverlayToaster.create({
  position: Position.TOP,
});

type ExportClipboardModalProps = {
  previewImageIdentifier: string;
};

function ExportClipboardModal({
  previewImageIdentifier,
}: ExportClipboardModalProps) {
  const { isOpen, close } = useModal('exportClipboard');
  const { logger } = useLog();

  const ROIs = useOriginalFilteredROIs(previewImageIdentifier);
  const hasAnnotations = ROIs.length > 0;

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

  const mergeToImage = useMergeToImage(formState.annotations);

  const copyToClipboard = useCallback(() => {
    return mergeToImage().then(({ toSave }) => saveToClipboard(toSave));
  }, [mergeToImage]);

  const save = useCallback(() => {
    copyToClipboard()
      .catch((error) => {
        logger.error(`Failed to copy to clipboard: ${error}`);
        AppToaster.show({
          message: 'Failed to copy to clipboard',
          intent: 'danger',
          timeout: 1500,
        });
      })
      .finally(() => {
        resetForm();
        close();
      });
    AppToaster.show({
      message: 'Copied successfully !',
      intent: 'success',
      timeout: 1500,
    });
  }, [close, copyToClipboard, logger, resetForm]);

  if (!hasAnnotations) {
    save();
    return null;
  }

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
                  setFormState({
                    ...formState,
                    annotations: e.target.checked,
                  })
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