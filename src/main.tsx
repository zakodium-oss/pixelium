import { createRoot } from 'react-dom/client';

import Pixelium from './components/Pixelium';

const rootElement = document.querySelector('#root');
if (!rootElement) {
  throw new Error('#root element not found');
}

const root = createRoot(rootElement);
root.render(<Pixelium />);
