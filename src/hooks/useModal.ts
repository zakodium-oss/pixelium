import { useCallback, useMemo } from 'react';

import { CLOSE_MODAL, OPEN_MODAL } from '../state/view/ViewActionTypes';
import { ModalName } from '../state/view/ViewReducer';

import useView from './useView';
import useViewDispatch from './useViewDispatch';

export default function useModal(identifier: ModalName) {
  const view = useView();
  const viewDispatch = useViewDispatch();

  const isOpen = useMemo(
    () => view.modals[identifier],
    [view.modals, identifier],
  );
  const open = useCallback(
    () => viewDispatch({ type: OPEN_MODAL, payload: identifier }),
    [viewDispatch, identifier],
  );
  const close = useCallback(
    () => viewDispatch({ type: CLOSE_MODAL, payload: identifier }),
    [viewDispatch, identifier],
  );

  return { isOpen, open, close };
}
