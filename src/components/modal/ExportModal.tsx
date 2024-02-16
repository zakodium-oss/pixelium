import {
  Checkbox,
  InputGroup,
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

function ExportModal() {
  const { isOpen, close } = useModal('export');
  const data = useData();
  const preferences = usePreferences();
  const view = useView();
  const { logger } = useLog();

  const defaultFormState = useMemo(
    () => ({
      name: '',
      view: false,
      preferences: false,
      data: false,
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
    <Dialog title="Export Pixelium file" isOpen={isOpen} onClose={close}>
      <ExportStyle>
        <DialogBody>
          <StyledModalBody>
            <div>
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
              <Checkbox
                checked={formState.view}
                onChange={(e) =>
                  setFormState({ ...formState, view: e.target.checked })
                }
              />
              <Checkbox
                checked={formState.preferences}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    preferences: e.target.checked,
                  })
                }
              />
              <Checkbox
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
        <DialogFooter>
          <Button intent="primary" onClick={save}>
            <SaveButtonInner>Save</SaveButtonInner>
          </Button>
        </DialogFooter>
      </ExportStyle>
    </Dialog>
  );
}

export default memo(ExportModal);
