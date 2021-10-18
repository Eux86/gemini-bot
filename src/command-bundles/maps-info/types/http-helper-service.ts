export interface IHttpHelperService {
  getPageContent: (url: string, isHttp?: boolean) => Promise<string>;
}
