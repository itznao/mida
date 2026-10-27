import { SettingsPage } from './SettingsPage'

export function Content({ url }) {
  if (url === 'home') {
    return <HomePage />
  }
  if (url === 'settings') {
    return <SettingsPage />
  }

  return (
    <webview
      id="content"
      src={url}
      style={{ width: '100%', height: '100%' }}
      partition="persist:midaContentSession"
      allowpopups="true"
    />
  )
}
