import {
  FetchArgs,
  createApi,
  fetchBaseQuery,
  retry,
} from "@reduxjs/toolkit/query/react";
import { jwtDecode } from "jwt-decode";
import { RootState } from "../redux/store";
import { setToken } from "../redux/slices/session.slice";

async function getJwtToken(token?: string): Promise<string | undefined> {
  if (!token) return undefined;

  const result = jwtDecode<{ uuid: string }>(token);
  const payload = result;
  console.log(">>> Payload: ", payload);
  /**
   *  @todo:
   *    Validamos si el token actual todavias es válido de lo contrario
   *    podemos intentar volver a autenticar, refrescando el current token.
   *    Por ahora vamos a devolver el mismo token ya que expira en 7d segun
   *    la configuración de las variables de entorno.
   */
  return token;
}

export const baseQuery = fetchBaseQuery({
  baseUrl: "/api/v1/",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).session.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const staggeredBaseQueryWithBailOut = retry(
  async (args: string | FetchArgs, api, extraOptions) => {
    /** Verificamos si el token actual es válido */
    const currentToken = (api.getState() as RootState).session.token;
    const token = await getJwtToken(currentToken);
    if (token !== currentToken) {
      api.dispatch(setToken(token));
    }

    /** Hace la peticion con el token actualizado */
    const result = await baseQuery(args, api, extraOptions);
    const status =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result.error as any)?.originalStatus || result.error?.status || 0;

    if (status === 404 || status === 400) {
      retry.fail(result.error);
    }

    return result;
  },
  {
    maxRetries: 3,
  }
);

export const API = createApi({
  reducerPath: "API",
  baseQuery: staggeredBaseQueryWithBailOut,
  endpoints: () => ({}),
  tagTypes: ["GetUser", "GetToken", "GetTasks", "GetTask"],
});
