import { FifoLogger, LogEntry } from 'fifo-logger';
import { createContext, ReactNode, useMemo, useRef, useState } from 'react';

export interface LogState {
  logger: FifoLogger;
  logs: LogEntry[];
}

export const LogContext = createContext<LogState | null>(null);

interface LogProviderProps {
  children: ReactNode;
}

export function LogProvider({ children }: LogProviderProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const loggerRef = useRef<FifoLogger>(
    new FifoLogger({
      onChange: (log, logs) => {
        setLogs(logs.slice());
      },
    }),
  );
  const log = useMemo(
    () => ({
      logger: loggerRef.current,
      logs,
    }),
    [logs],
  );

  return <LogContext.Provider value={log}>{children}</LogContext.Provider>;
}
