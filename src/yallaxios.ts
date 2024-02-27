// eslint-disable-next-line import/no-extraneous-dependencies
import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import yall from './yall';

/**
 * YALL axios middleware settings
 */
export type YallAxiosConfig = {
  readLevel?: string; // log level used for GET and HEAD calls. Default: debug
  writeLevel?: string; // log level used for all other calls. Default: info
};

/**
 * Convert axios response to displayable message
 */
function responseToMessage(res: AxiosResponse): string {
  const req = res.config;

  const sendTime = Number(req.headers.sendTime);
  const elapsedTime = Date.now() - sendTime;
  const length = res.headers['content-length'] || (res.data as string)?.length;
  const url = `${req.baseURL || ''}${req.url || ''}`;
  const message = `Send ${req.method.toUpperCase()} ${url} - ${res.status} ${length} ${elapsedTime}ms`;

  return message;
}

/**
 * Decorate Axios instance with YALL logging
 */
export function yallAxiosConnect(instance: AxiosInstance, config?: YallAxiosConfig): AxiosInstance {
  // default config values
  const finalConfig: YallAxiosConfig = {
    readLevel: 'debug',
    writeLevel: 'info',
    ...config,
  };

  const onRequest = <D>(req: InternalAxiosRequestConfig<D>) => {
    req.headers.sendTime = Date.now().toString();
    return req;
  };

  const onResponse = (res: AxiosResponse) => {
    const req = res.config;

    const method = req.method.toUpperCase();
    const level = method === 'GET' || method === 'HEAD' ? finalConfig.readLevel : finalConfig.writeLevel;

    yall.stackInfo = 'axios';
    yall.logger.log(level, responseToMessage(res));

    return res;
  };

  const onError = (error: unknown) => {
    yall.stackInfo = 'axios';

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError?.response?.config) {
        yall.logger.warn(responseToMessage(axiosError.response));
      } else {
        yall.logger.warn(`Axios error: ${axiosError}`);
      }
    } else {
      yall.logger.error(`Unknown error ${error}`);
    }
    throw error;
  };

  instance.interceptors.request.use(onRequest);
  instance.interceptors.response.use(onResponse, onError);

  return instance;
}
