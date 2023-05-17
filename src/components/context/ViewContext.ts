import { createContext } from 'react';

import { initialViewState, ViewState } from '../../state/view/ViewReducer';

export const ViewContext = createContext<ViewState>(initialViewState);

export const ViewProvider = ViewContext.Provider;
