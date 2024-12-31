import {
  Filter,
  Todo,
  TodoListDtoSchema,
  TodoPostDtoSchema,
  TodoPutDtoSchema,
} from "todo-types";
import { API } from "../API";

const extendedApi = API.injectEndpoints({
  endpoints: (builder) => ({
    createTask: builder.mutation<void, TodoPostDtoSchema>({
      query(body) {
        return {
          url: `/tasks`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["GetTasks"],
    }),
    getTasks: builder.query<
      TodoListDtoSchema,
      Filter | undefined | void | null
    >({
      query: (filters = {}) => ({
        url: `/tasks?${new URLSearchParams(filters as Record<string, string>).toString()}`,
        method: "GET",
      }),
      providesTags: ["GetTasks"],
    }),
    getTask: builder.query<Todo, { uuid: string }>({
      query: ({ uuid }) => ({
        url: `/tasks/${uuid}`,
        method: "GET",
      }),
      providesTags: ["GetTask"],
    }),
    updateTask: builder.mutation<void, TodoPutDtoSchema>({
      query(body) {
        return {
          url: `/tasks/${body.uuid}`,
          method: "PATCH",
          body,
        };
      },
      // Esto se puede mejorar haciendo la request solo para la que se actualizo
      invalidatesTags: ["GetTask", "GetTasks"],
    }),
    deleteTask: builder.mutation<void, { uuid: string }>({
      query(body) {
        return {
          url: `/tasks/${body.uuid}`,
          method: "DELETE",
          body,
        };
      },
      invalidatesTags: ["GetTask", "GetTasks"],
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useGetTasksQuery,
  useGetTaskQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = extendedApi;
