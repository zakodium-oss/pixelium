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
  markAsRead: () => void;
  unreadCount: number;
  unreadLevel: number;
}

export const LogContext = createContext<LogState | null>(null);

interface LogProviderProps {
  children: ReactNode;
}

export let logger: FifoLogger;

export function LogProvider({ children }: LogProviderProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const loggerRef = useRef<FifoLogger>(
    new FifoLogger({
      onChange: (log, logs) => {
        setLogs(logs.slice());
      },
    }),
  );

  logger = loggerRef.current;

  const clear = useCallback(() => {
    loggerRef.current.clear();
    setLogs([]);
  }, [setLogs]);

  const [lastReadLogId, setLastLogId] = useState(0);
  const markAsRead = useCallback(() => {
    if (logs.length <= 0) return;
    const id = logs.at(-1)?.id || 0;
    setLastLogId(id);
  }, [logs, setLastLogId]);

  const unreadCount = useMemo(() => {
    if (logs.length <= 0) return 0;
    return (logs.at(-1)?.id || 0) - lastReadLogId;
  }, [lastReadLogId, logs]);

  const unreadLevel = useMemo(() => {
    return (
      logs
        .filter((log) => log.id > lastReadLogId)
        // eslint-disable-next-line unicorn/no-array-reduce
        .reduce((acc, log) => (log.level > acc ? log.level : acc), -1)
    );
  }, [lastReadLogId, logs]);

  const log: LogState = useMemo(
    () => ({
      logger: loggerRef.current,
      logs,
      clear,
      markAsRead,
      unreadCount,
      unreadLevel,
    }),
    [clear, logs, markAsRead, unreadCount, unreadLevel],
  );

  return <LogContext.Provider value={log}>{children}</LogContext.Provider>;
}
