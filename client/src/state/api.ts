import { Manager, Tenant } from "@/types/prismaTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      const {idToken} = session.tokens ?? {};
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken.toString()}`);
      }
      return headers;
    }
  }),
  reducerPath: "api", // slice name in Redux store 
  tagTypes: [],
  endpoints: (build) => ({
    getAuthUser: build.query<User, void>({
      queryFn: async (_, _queryApi, __extraoptions, fetchWithBQ) => {
        try {
          debugger;
          const session = await fetchAuthSession();
          const {idToken} = session.tokens ?? {};
          const user = await getCurrentUser();
          const userRole = idToken?.payload?.['custom:role'] as string
          const endpoint = userRole === "manager" ? `/manager/${user.userId}` : `/tenant/${user.userId}`;
          const userDetailResponse = await fetchWithBQ(endpoint);
          if (userDetailResponse.error && userDetailResponse.error.status === 404) {
            const creatEndPoint = userRole === "manager" ? `/manager` : `/tenant`;
            const createUserResponse = await fetchWithBQ({
              url: creatEndPoint,
              method: "POST",
              body: {
                cognitoId: user.userId,
                name: user.username,
                email: idToken?.payload.email || "",
                phoneNumber: ""
              }
            });
            if (createUserResponse.error) {
              return { error: { status: "CUSTOM_ERROR", error: "Failed to find user" } };
            }
            return {
              data: {
                cognitoInfo: {...user},
                userInfo: createUserResponse.data as Tenant | Manager,
                userRole: userRole,
              }
            }
          }
          return { 
            data: {
              cognitoInfo: {...user},
              userInfo: userDetailResponse.data as Tenant | Manager,
              userRole: userRole,
            }
          };
        } catch (_err: unknown) {
          return { error: { status: "CUSTOM_ERROR", error: "Failed to fetch user" } };
        }
      },
    }),
  }),
});

export const { useGetAuthUserQuery} = api;