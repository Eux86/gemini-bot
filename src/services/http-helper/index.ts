import https from 'https';
import http from 'http';
import { IHttpHelperService } from '../interfaces/http-helper-service';

export class HttpHelper implements IHttpHelperService {
  getPageContent = async (url: string, isHttp: boolean = false): Promise<string> => new Promise((resolve, reject) => {
    const request = (isHttp ? http : https).get(url, (resp: any) => {
      let data = '';
      resp.on('data', (chunk: any) => {
        data += chunk;
      });
      resp.on('end', () => {
        resolve(data);
      });
    }).on('error', (err: any) => {
      reject(`Error: ${err.message}`);
    });
    request.setTimeout(10000, () => {
      reject({ code: 'timeout', message: `Request timeout for url: ${url}` });
    });
  });
}
