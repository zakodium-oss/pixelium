import { css } from '@emotion/react';
import { GreyAlgorithm } from 'image-js';
import { memo } from 'react';
import { Modal } from 'react-science/ui';

const modalStyle = css`
  display: flex;
  flex-direction: column;
  width: 50vw;

  .header {
    font-size: 1.25rem;
  }

  .container {
    padding: 20px;
  }
`;

interface ExportGreyModalProps {
  isOpenDialog: boolean;
  closeDialog: () => void;
}

function ExploreGreyModal({ isOpenDialog, closeDialog }: ExportGreyModalProps) {
  return (
    <Modal isOpen={isOpenDialog} onRequestClose={closeDialog} hasCloseButton>
      <div css={modalStyle}>
        <Modal.Header>
          <div className="header">Explore grey filters</div>
        </Modal.Header>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {Object.keys(GreyAlgorithm).map((key) => {
            return (
              <div key={key} style={{ width: '33.33333%' }}>
                {key}
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}

export default memo(ExploreGreyModal);
