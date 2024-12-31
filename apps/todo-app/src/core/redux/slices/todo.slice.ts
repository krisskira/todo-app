import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Todo } from "todo-types";

const TodoInitialState: Todo[] = [];

export const TodosSlice = createSlice({
  name: "todos",
  initialState: TodoInitialState,
  reducers: {
    todoAdded(state, action: PayloadAction<Todo>) {
      state.push({
        uuid: action.payload.uuid,
        completed: action.payload.completed,
        title: action.payload.title,
        description: action.payload.description,
        createdAt: action.payload.createdAt,
      });
    },
  },
});

export const { todoAdded } = TodosSlice.actions;
