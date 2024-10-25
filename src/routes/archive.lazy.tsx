import { createLazyFileRoute } from '@tanstack/react-router';
import Archive from '../features/Archive/Archive';

export const Route = createLazyFileRoute('/archive')({
  component: () => <Archive />
});
