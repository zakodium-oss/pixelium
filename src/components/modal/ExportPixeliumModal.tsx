import {
  Checkbox,
  InputGroup,
  FormGroup,
  Dialog,
  DialogBody,
  DialogFooter,
} from '@blueprintjs/core';
import styled from '@emotion/styled';
import { memo, useCallback, useMemo, useState } from 'react';
import { Button } from 'react-science/ui';

import useData from '../../hooks/useData';
import useLog from '../../hooks/useLog';
import useModal from '../../hooks/useModal';
import usePreferences from '../../hooks/usePreferences';
import useView from '../../hooks/useView';
import { savePixeliumBundle } from '../../utils/export';

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

function ExportPixeliumModal() {
  const { isOpen, close } = useModal('exportPixelium');
  const data = useData();
  const preferences = usePreferences();
  const view = useView();
  const { logger } = useLog();

  const defaultFormState = useMemo(
    () => ({
      name: '',
      view: true,
      preferences: true,
      data: true,
    }),
    [],
  );

  const [formState, setFormState] = useState(defaultFormState);
  const resetForm = useCallback(
    () => setFormState(defaultFormState),
    [setFormState, defaultFormState],
  );

  const save = useCallback(() => {
    savePixeliumBundle({
      name: formState.name.length > 0 ? formState.name : 'Untitled',
      view: formState.view ? view : null,
      preferences: formState.preferences ? preferences : null,
      data: formState.data ? data : null,
    })
      .catch((error) => {
        logger.error(`Error while exporting Pixelium file: ${error}`);
      })
      .finally(() => {
        resetForm();
        close();
      });
  }, [
    close,
    data,
    formState.data,
    formState.name,
    formState.preferences,
    formState.view,
    logger,
    preferences,
    resetForm,
    view,
  ]);

  return (
    <Dialog
      title="Export Pixelium file"
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
              <Checkbox
                label="Include view"
                alignIndicator="right"
                checked={formState.view}
                onChange={(e) =>
                  setFormState({ ...formState, view: e.target.checked })
                }
              />
              <Checkbox
                label="Include preferences"
                alignIndicator="right"
                checked={formState.preferences}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    preferences: e.target.checked,
                  })
                }
              />
              <Checkbox
                label="Include data"
                alignIndicator="right"
                checked={formState.data}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    data: e.target.checked,
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
              <SaveButtonInner>Save</SaveButtonInner>
            </Button>
          }
        />
      </ExportStyle>
    </Dialog>
  );
}

export default memo(ExportPixeliumModal);
