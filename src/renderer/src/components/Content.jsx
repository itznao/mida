import { SettingsPage } from './SettingsPage'

export function Content({ url }) {
  if (url === 'settings') {
    return <SettingsPage />
  }

  return (
    <webview
      src={url}
      style={{ width: '100%', height: '100%' }}
      partition="persist:bungie"
      allowpopups="true"
    />
  )
}
