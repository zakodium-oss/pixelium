import { WebSource } from 'filelist-utils';
import { memo, ReactNode, useEffect } from 'react';

import useFileLoader from '../hooks/useFileLoader';
import useLog from '../hooks/useLog';

interface AutoLoaderProps {
  webSource?: WebSource;
  setWebSource?: (webSource: WebSource) => void;
  children: ReactNode;
}

function AutoLoader({ children, webSource, setWebSource }: AutoLoaderProps) {
  const { handleWebSource } = useFileLoader();
  const { logger } = useLog();

  useEffect(() => {
    if (webSource === undefined) return;

    handleWebSource(webSource).catch((error) => {
      logger.error(`Error while loading websource: ${error.message}`);
    });

    setWebSource?.({ entries: [] });
  }, [handleWebSource, logger, webSource, setWebSource]);

  return children;
}

export default memo(AutoLoader);
