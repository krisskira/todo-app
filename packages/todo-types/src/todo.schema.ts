import { PaginationInfo } from "./filter.schema";

export type Todo = {
  uuid: string;
  title: string;
  description: string;
  createdAt: string | Date;
  completed: boolean;
};

export type TodoPostDtoSchema = {
  title: string;
  description: string;
};

export type TodoListDtoSchema = {
  todos: Todo[];
  metadata: PaginationInfo;
};

export type TodoPutDtoSchema = {
  uuid: string;
  title?: string;
  description?: string;
  completed?: boolean;
};
