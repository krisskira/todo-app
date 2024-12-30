export type User = {
  uuid?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
};

export type UserPatchDtoSchema = {
  uuid: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
};
