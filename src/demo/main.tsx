import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';

import 'react-science/styles/preflight.css';

import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import MainView from './views/MainView';

import 'modern-normalize/modern-normalize.css';

const rootElement = document.querySelector('#root');
if (!rootElement) {
  throw new Error('#root element not found');
}

const root = createRoot(rootElement);
root.render(
  <HashRouter>
    <Routes>
      <Route path="*" element={<MainView />} />
    </Routes>
  </HashRouter>,
);
