import { RegisterPostDtoSchema } from "todo-types";
import { API } from "../API";

const extendedApi = API.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<
      { message: string; data: string },
      RegisterPostDtoSchema
    >({
      query(body) {
        return {
          url: `/security/register`,
          method: "POST",
          body,
        };
      },
    }),
    login: builder.mutation<
      { token: string },
      { email: string; password: string }
    >({
      query: ({ email, password }) => ({
        url: `/security/login`,
        method: "GET",
        headers: {
          authorization: `Basic ${btoa(email + ":" + password)}`,
        },
      }),
    }),
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query(body) {
        return {
          url: `/security/forgot-password`,
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useForgotPasswordMutation,
} = extendedApi;
