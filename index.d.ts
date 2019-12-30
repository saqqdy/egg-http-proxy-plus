import 'egg';
import * as httpProxyMiddleware from 'http-proxy-middleware';

declare module 'egg' {
  interface ProxyConfigMap {
    [url: string]: string | httpProxyMiddleware.Config;
  }

  type ProxyConfigArrayItem = {
    path?: string | string[];
    context?: string | string[] | httpProxyMiddleware.Filter;
  } & httpProxyMiddleware.Config;

  type ProxyConfigArray = ProxyConfigArrayItem[];

  interface EggAppConfig {
    httpProxy: ProxyConfigMap | ProxyConfigArray;
  }
}
