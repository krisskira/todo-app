export type LoginPostDtoSchema = {
  email: string;
  password: string;
};

export type LoginResponseDtoSchema = {
  token: string;
};

export type RegisterPostDtoSchema = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type ForgotPasswordPostDtoSchema = {
  email: string;
};
