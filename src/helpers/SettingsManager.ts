import Settings from '@/types/Settings'

const SettingsManager = {
  getOrCreateSettings (): Settings {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedSettingsJson = window.localStorage.getItem('settings')
      if (storedSettingsJson === null) {
        const settings = {
          darkMode: false,
          abbreviation: true,
          multipleSelection: false,
          addDayToCurrentDate: true
        } as Settings

        const userMedia = window.matchMedia('(prefers-color-scheme: dark)')
        if (userMedia.matches) {
          settings.darkMode = true
        }

        window.localStorage.setItem('settings', JSON.stringify(settings))
        return settings
      }

      return JSON.parse(<string>storedSettingsJson)
    }

    throw new Error('SSR on or don`t access to local storage')
  },
  setSettings (settings: Settings) {
    const storedSettings = this.getOrCreateSettings()
    if (JSON.stringify(storedSettings) !== JSON.stringify(settings)) {
      window.localStorage.setItem('settings', JSON.stringify(settings))
    }
  }
}

export default SettingsManager
