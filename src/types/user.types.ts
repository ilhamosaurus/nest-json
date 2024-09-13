/* eslint-disable @typescript-eslint/no-unused-vars */
type TokenPayload = {
  sub: number;
  email: string;
  username: string;
};

type UserRequest = {
  id: number;
  email: string;
  username: string;
};

type RegisterResponse = {
  statusCode: number;
  message: string;
  data: null;
};
