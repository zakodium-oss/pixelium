import { memo, ReactNode, useEffect } from 'react';

import useFileLoader from '../hooks/useFileLoader';
import useLog from '../hooks/useLog';

import { useWebSource } from './context/WebSourceContext';

interface AutoLoaderProps {
  children: ReactNode;
}

function AutoLoader({ children }: AutoLoaderProps) {
  const { webSource, setWebSource } = useWebSource();

  const { handleWebSource } = useFileLoader();
  const { logger } = useLog();

  useEffect(() => {
    if (webSource === undefined) return;

    handleWebSource(webSource).catch((error) => {
      logger.error(`Error while loading websource: ${error.message}`);
    });

    setWebSource?.(undefined);
  }, [handleWebSource, logger, webSource, setWebSource]);

  return children;
}

export default memo(AutoLoader);
