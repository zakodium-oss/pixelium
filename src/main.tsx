import { createRoot } from 'react-dom/client';

import MainView from './demo/views/MainView';

import 'modern-normalize/modern-normalize.css';
import { HashRouter, Route, Routes } from 'react-router-dom';

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
