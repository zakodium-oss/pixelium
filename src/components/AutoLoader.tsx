import { WebSource } from 'filelist-utils';
import { memo, ReactNode, useEffect } from 'react';

import useFileLoader from '../hooks/useFileLoader';
import useLog from '../hooks/useLog';

interface AutoLoaderProps {
  webSource?: WebSource;
  children: ReactNode;
}

function AutoLoader({ children, webSource }: AutoLoaderProps) {
  const { handleWebSource } = useFileLoader();
  const { logger } = useLog();

  useEffect(() => {
    if (webSource === undefined) return;

    handleWebSource(webSource).catch((error) => {
      logger.error(`Error while loading websource: ${error.message}`);
    });
  }, [handleWebSource, logger, webSource]);

  return children;
}

export default memo(AutoLoader);
