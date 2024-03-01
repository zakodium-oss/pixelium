import styled from '@emotion/styled';
import { memo, useCallback, useRef } from 'react';
import { FaFileImport } from 'react-icons/fa';
import { Toolbar } from 'react-science/ui';

import useFileLoader from '../../hooks/useFileLoader';

const StyledImportInput = styled.input`
  display: none;
`;

function ImportTool() {
  const inputRef = useRef<HTMLInputElement>(null);

  const openFileDialog = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);

  const { handleFileLoad } = useFileLoader();

  const handleOnChange = useCallback(
    (event) => {
      handleFileLoad(event.target.files);
    },
    [handleFileLoad],
  );

  return (
    <>
      <Toolbar.Item
        title={'Import file'}
        icon={<FaFileImport />}
        onClick={openFileDialog}
      />
      <StyledImportInput
        ref={inputRef}
        type="file"
        multiple
        onChange={handleOnChange}
      />
    </>
  );
}

export default memo(ImportTool);
