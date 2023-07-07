import {
  createContext,
  createRef,
  ReactNode,
  RefObject,
  useMemo,
  useState,
} from 'react';

interface AnnotationsState {
  svgRef: RefObject<SVGSVGElement | null>;
  setSvgRef: (ref: RefObject<SVGSVGElement>) => void;
}

export const AnnotationsContext = createContext<AnnotationsState>({
  svgRef: createRef(),
  setSvgRef: () => {},
});

interface AnnotationsProviderProps {
  children: ReactNode;
}

export function AnnotationsProvider({ children }: AnnotationsProviderProps) {
  const [svgRef, setSvgRef] = useState<RefObject<SVGSVGElement>>(createRef);
  const contextContent = useMemo(
    () => ({ svgRef, setSvgRef }),
    [svgRef, setSvgRef],
  );
  return (
    <AnnotationsContext.Provider value={contextContent}>
      {children}
    </AnnotationsContext.Provider>
  );
}
