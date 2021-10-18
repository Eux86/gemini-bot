export interface ISettings {
  connectedPlayersNotificationsEnabled: boolean;
}

export interface ISettingsService {
  getSettingsAsync: () => Promise<ISettings>;
  setSettingsAsync: (newSettings: ISettings) => Promise<string | undefined>;
}
