import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "todo-types";

export interface SessionState {
  isLoggedIn?: boolean;
  token?: string;
  user?: Pick<User, "uuid" | "firstName" | "lastName" | "email">;
}

const initialState: SessionState = {
  isLoggedIn: false,
  token: undefined,
  user: undefined,
};

export const SessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<SessionState["user"]>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<SessionState["token"]>) => {
      state.isLoggedIn = !!action.payload;
      state.token = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = undefined;
      state.user = undefined;
    },
  },
});

export const { logout, setToken, setUserInfo } = SessionSlice.actions;
