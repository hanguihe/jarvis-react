declare interface ResponseStruct<T> {
  success: boolean;
  message: string;
  data: T;
}

declare type ApiResponse<T = null> = Promise<ResponseStruct<T>>;
