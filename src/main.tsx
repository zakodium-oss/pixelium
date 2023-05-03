import { createRoot } from 'react-dom/client';

const rootElement = document.querySelector('#root');
if (!rootElement) {
  throw new Error('#root element not found');
}

const root = createRoot(rootElement);
root.render(<h1>Hello, world!</h1>);
