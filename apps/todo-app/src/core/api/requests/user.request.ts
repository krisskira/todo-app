import { User, UserPatchDtoSchema } from "todo-types";
import { API } from "../API";

const extendedApi = API.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<
      { data: Omit<User, "password">; message: string },
      void
    >({
      query: () => ({
        url: `/user`,
        method: "GET",
      }),
      providesTags: ["GetUser"],
    }),
    updateUser: builder.mutation<void, UserPatchDtoSchema>({
      query(body) {
        return {
          url: `/user`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["GetUser"],
    }),
    deleteUser: builder.mutation<void, { uuid: string }>({
      query(body) {
        return {
          url: `/user`,
          method: "DELETE",
          body,
        };
      },
      invalidatesTags: ["GetUser"],
    }),
  }),
});

export const { useGetUserQuery, useUpdateUserMutation, useDeleteUserMutation } =
  extendedApi;
