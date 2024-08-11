import { createLazyFileRoute } from '@tanstack/react-router';
import App from '../App';

export const Route = createLazyFileRoute('/' as never)({
  component: Index
});

function Index() {
  return <App />;
}
