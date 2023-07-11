import { css } from '@emotion/react';
import { memo, useCallback, useMemo, useState } from 'react';
import { Button, Checkbox, Field, Input, Modal } from 'react-science/ui';

import useData from '../../hooks/useData';
import useLog from '../../hooks/useLog';
import useModal from '../../hooks/useModal';
import usePreferences from '../../hooks/usePreferences';
import useView from '../../hooks/useView';
import { buttons } from '../../utils/colors';
import { savePixeliumBundle } from '../../utils/export';

import StyledModalBody from './utils/StyledModalBody';
import StyledModalHeader from './utils/StyledModalHeader';

const modalStyle = css`
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
    <Modal isOpen={isOpen} onRequestClose={close} hasCloseButton>
      <div css={modalStyle}>
        <StyledModalHeader>
          <Modal.Header>
            <div className="header">Export Pixelium file</div>
          </Modal.Header>
        </StyledModalHeader>
        <Modal.Body>
          <StyledModalBody>
            <div>
              <Field name="name" label="Name">
                <Input
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
              </Field>
              <Field name="view" label="Include view">
                <Checkbox
                  checked={formState.view}
                  onChange={(checked) =>
                    setFormState({ ...formState, view: checked as boolean })
                  }
                />
              </Field>
              <Field name="preferences" label="Include preferences">
                <Checkbox
                  checked={formState.preferences}
                  onChange={(checked) =>
                    setFormState({
                      ...formState,
                      preferences: checked as boolean,
                    })
                  }
                />
              </Field>
              <Field name="data" label="Include data">
                <Checkbox
                  checked={formState.data}
                  onChange={(checked) =>
                    setFormState({
                      ...formState,
                      data: checked as boolean,
                    })
                  }
                />
              </Field>
            </div>
          </StyledModalBody>
        </Modal.Body>
        <Modal.Footer>
          <Button backgroundColor={buttons.info} onClick={save}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Save
            </span>
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
}

export default memo(ExportModal);
