import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/archive')({
  component: () => <div>Hello /archive!</div>,
})
