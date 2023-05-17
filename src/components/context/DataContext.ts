import { createContext } from 'react';

import { DataState, initialDataState } from '../../state/data/DataReducer';

export const DataContext = createContext<DataState>(initialDataState);

export const DataProvider = DataContext.Provider;
