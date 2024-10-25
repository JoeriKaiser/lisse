import { createLazyFileRoute } from '@tanstack/react-router';
import SettingsContainer from '../features/Settings/SettingsContainer';

export const Route = createLazyFileRoute('/settings')({
  component: () => (
    <div>
      <SettingsContainer />
    </div>
  )
});
