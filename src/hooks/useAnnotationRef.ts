import { useContext } from 'react';

import { AnnotationsContext } from '../components/context/AnnotationsContext';

export default function useAnnotationRef() {
  return useContext(AnnotationsContext);
}
