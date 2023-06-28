import { useMemo } from 'react';

import useData from './useData';
import useView from './useView';

export default function useDefaultOptions<OptionsType>(
  defaultOptions: OptionsType,
) {
  const data = useData();
  const view = useView();

  const { editMode } = view;

  const existingOptions = useMemo(() => {
    if (editMode === null) return null;
    const { identifier, opIdentifier } = editMode;
    const operation = data.images[identifier].pipeline.find(
      (operation) => operation.identifier === opIdentifier,
    );

    if (operation === undefined) return null;
    if (!('options' in operation)) return undefined;

    return operation.options as OptionsType;
  }, [data.images, editMode]);

  return {
    defaultOptions: existingOptions ?? defaultOptions,
    editing: existingOptions !== null,
    opIdentifier: editMode?.opIdentifier ?? undefined,
  };
}
