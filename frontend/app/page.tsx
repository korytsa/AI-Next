import { RedirectToChat } from './RedirectToChat'

export const revalidate = 3600

export default function Home() {
  return <RedirectToChat />
}
