import { css } from '@emotion/react';
import { memo } from 'react';
import { FaFileExport } from 'react-icons/all';
import { Modal, Toolbar, useOnOff } from 'react-science/ui';

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
  const [isOpenDialog, openDialog, closeDialog] = useOnOff(false);

  return (
    <>
      <Toolbar.Item
        title="Export"
        titleOrientation="horizontal"
        onClick={openDialog}
      >
        <FaFileExport />
      </Toolbar.Item>
      <Modal isOpen={isOpenDialog} onRequestClose={closeDialog} hasCloseButton>
        <div css={modalStyle}>
          <StyledModalHeader>
            <Modal.Header>
              <div className="header">Export</div>
            </Modal.Header>
          </StyledModalHeader>
          <StyledModalBody>
            <Modal.Body>Nothing to see here at this time.</Modal.Body>
          </StyledModalBody>
        </div>
      </Modal>
    </>
  );
}

export default memo(ExportModal);
