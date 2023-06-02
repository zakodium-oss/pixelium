import { FifoLogger, LogEntry } from 'fifo-logger';
import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

export interface LogState {
  logger: FifoLogger;
  logs: LogEntry[];
  clear: () => void;
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

  const clear = useCallback(() => {
    loggerRef.current.clear();
    setLogs([]);
  }, [setLogs]);

  const log: LogState = useMemo(
    () => ({
      logger: loggerRef.current,
      logs,
      clear,
    }),
    [clear, logs],
  );

  return <LogContext.Provider value={log}>{children}</LogContext.Provider>;
}
