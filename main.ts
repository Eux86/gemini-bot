import Bot from './src/bot';
import { SettingsService } from './src/services/settings';
import { ISettingsService } from "./src/models/settings-service";
require('dotenv').config();

new Bot();