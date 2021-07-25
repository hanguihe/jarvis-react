import { extend, ResponseError } from 'umi-request';
import { notification } from 'antd';

async function errorHandler(error: ResponseError) {
  const { response } = error;

  if (response?.status) {
    const data = await response.clone().json();
    const text = data.message || response.statusText;

    notification.error({
      message: `请求错误${response.status}`,
      description: text,
    });
  } else if (!response) {
    notification.error({
      message: '网络异常',
      description: '您的网络发生异常，无法连接服务器',
    });
  }

  return response;
}

const request = extend({
  errorHandler,
  credentials: 'include',
});

export default request;
