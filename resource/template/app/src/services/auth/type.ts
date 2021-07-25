export interface UserInfo {
  uid: number;
  nick: string;
  email: string;
}

export namespace AuthService {
  export type AuthUserResponse = ApiResponse<UserInfo>;
}
