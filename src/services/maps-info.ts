import cheerio from 'cheerio';
import https from 'https';
import http from 'http';
import { IMapsInfoService } from "../models/maps-info-service";

export class MapsInfoService implements IMapsInfoService {
  getPageContent = async (url: string, isHttp: boolean = false): Promise<string> => {
    return new Promise((resolve, reject) => {
      const request = (isHttp? http : https).get(url, (resp: any) => {
        let data = '';
        resp.on('data', (chunk: any) => {
          data += chunk;
        });
        resp.on('end', () => {
          resolve(data);
        });
      }).on("error", (err: any) => {
        reject("Error: " + err.message);
      });
      request.setTimeout(10000, () => {
        reject({ code: 'timeout', message: `Request timeout for url: ${url}` });
      });
    })
  };

  getAll = async (): Promise<string> => {
    const data = await this.getPageContent(`https://combatbox.net/en/`);
    const $ = cheerio.load(data);
    const selector = '#main > div > div.dominant_coal';
    const mapName = $(selector).text().trim();
    return `
Current map: ${mapName}
    `;
  };
}
