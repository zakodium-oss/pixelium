import { css } from '@emotion/react';
import { memo } from 'react';
import { FaFileExport } from 'react-icons/fa';
import { Modal, Toolbar } from 'react-science/ui';

import useModal from '../../hooks/useModal';

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
  const { isOpen, open, close } = useModal('export');

  return (
    <>
      <Toolbar.Item title="Export" titleOrientation="horizontal" onClick={open}>
        <FaFileExport />
      </Toolbar.Item>
      <Modal isOpen={isOpen} onRequestClose={close} hasCloseButton>
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
