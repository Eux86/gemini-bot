import { ISettings, ISettingsService } from "../models/settings-service";

const fs = require('fs');

class DefaultSettings implements ISettings {
  connectedPlayersNotificationsEnabled = true;
}

export class SettingsService implements ISettingsService {
  private readonly SETTINGS_FILE_PATH = './settings.json';
  private static instance: SettingsService;
  private settings: ISettings | undefined = undefined;

  private constructor() {
    // Creates the file in case the file doesn't exist already (first run?)
    if (!fs.existsSync(this.SETTINGS_FILE_PATH)) {
      this.settings = new DefaultSettings();
      this.setSettingsAsync(this.settings);
    }
  }

  public static getInstance = () => {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  public getSettingsAsync = async (): Promise<ISettings> => {
    return new Promise((resolve: any, reject: any) => {
      if (this.settings) {
        resolve(this.settings);
      } else {
        fs.readFile(this.SETTINGS_FILE_PATH, 'utf8', (err: string, data: any) => {
          if (err) {
            reject(err);
          } else {
            this.settings = JSON.parse(data);
            resolve(this.settings);
          }
        })
      }
    });
  }

  public setSettingsAsync = async (newSettings: ISettings): Promise<string | undefined> => {
    return new Promise((resolve: any, reject: any) => {
      fs.writeFile(this.SETTINGS_FILE_PATH, JSON.stringify(newSettings, null, 2), 'utf8', (err: string) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
