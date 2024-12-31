import { RegisterPostDtoSchema } from "todo-types";
import {
  useForgotPasswordMutation,
  useGetUserQuery,
  useLoginMutation,
  useRegisterMutation,
} from "../core/api/requests";
import { useAppDispatch, useAppSelector } from "../core/redux/hooks";
import { setToken, setUserInfo } from "../core/redux/slices/session.slice";
import { useCallback, useEffect } from "react";

export const useSession = () => {
  const {
    isLoggedIn,
    user: USER,
    token,
  } = useAppSelector((state) => state.session);

  const dispatch = useAppDispatch();

  const [doRegister, { isLoading: rLoading, isError: rError, data: rData }] =
    useRegisterMutation();

  const [doLogin, { isLoading: lLoading, isError: lError, data: lData }] =
    useLoginMutation();

  const [
    doForgotPassword,
    { isLoading: fLoading, isError: fError, data: fData },
  ] = useForgotPasswordMutation();

  const {
    data: uData,
    isLoading: uLoading,
    isError: uError,
    refetch: doGetUser,
  } = useGetUserQuery(void token, {
    skip: !isLoggedIn,
    refetchOnMountOrArgChange: true,
  });

  const regieter = async (user: RegisterPostDtoSchema) => {
    return doRegister(user).unwrap();
  };

  const login = async (email: string, password: string) => {
    try {
      if (isLoggedIn) return;
      const { token } = await doLogin({ email, password }).unwrap();
      dispatch(setToken(token));
    } catch (error) {
      console.error(">>> Login Error: ", error);
    }
  };

  const logout = () => {
    dispatch(setToken(undefined));
    dispatch(setUserInfo(undefined));
  };

  const forgotPassword = async (email: string) => {
    return doForgotPassword({ email }).unwrap();
  };

  const getUser = useCallback(async () => {
    const { data: user } = await doGetUser().unwrap();
    dispatch(setUserInfo(user));
  }, [dispatch, doGetUser]);

  useEffect(() => {
    if (isLoggedIn && !USER?.uuid) getUser();
  }, [USER, getUser, isLoggedIn]);

  return {
    register: {
      isLoading: rLoading,
      isError: rError,
      data: rData,
      execute: regieter,
    },
    login: {
      isLoading: lLoading,
      isError: lError,
      data: lData,
      execute: login,
    },
    forgotPassword: {
      isLoading: fLoading,
      isError: fError,
      data: fData,
      execute: forgotPassword,
    },
    logout,
    isLoggedIn,
    user: {
      isLoading: uLoading,
      isError: uError,
      data: uData?.data,
      execute: getUser,
    },
  };
};

export default useSession;
