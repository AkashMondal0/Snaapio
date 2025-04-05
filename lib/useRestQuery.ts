import { configs } from "@/configs";
import { loadingType, Session } from "@/types";
import { useCallback, useEffect, useReducer, useRef } from "react";
import { getSecureStorage } from "./SecureStore";

const BASE_URL = configs.serverApi.baseUrl.replace("/v1", "");

// Define action types for the reducer
type Action<T> =
	| { type: "FETCH_INIT" }
	| { type: "FETCH_SUCCESS"; payload: T }
	| { type: "FETCH_FAILURE"; error: string }
	| { type: "RESET" };

// Define the state structure
interface State<T> {
	data: T | null;
	loading: loadingType;
	error: string | null;
}

interface UseRestQueryParams<T> {
	url?: string;
	options?: RequestInit;
	method?: "POST" | "GET" | "PUT" | "DELETE" | "PATCH";
	withCredentials?: boolean;
	errorCallBack?: (error: any[]) => void;
	initialFetch?: boolean;
	enableToken?: boolean;
	onChangeData?: (data: T) => void;
}

export const useRestQuery = <T>({
	url = BASE_URL,
	withCredentials = true,
	errorCallBack,
	initialFetch = true,
	enableToken = true,
	method = "GET",
	options = {},
	onChangeData = (data: T) => data,
}: UseRestQueryParams<T>): {
	data: T | null;
	loading: loadingType;
	error: string | null;
	fetch: (data?: any) => void;
	reset: () => void;
	reload: () => void;
} => {
	const [state, dispatch] = useReducer(
		(state: State<T>, action: Action<T>): State<T> => {
			switch (action.type) {
				case "FETCH_INIT":
					return { ...state, loading: "pending", error: null };
				case "FETCH_SUCCESS":
					return { ...state, loading: "normal", data: action.payload };
				case "FETCH_FAILURE":
					return { ...state, loading: "normal", error: action.error };
				case "RESET":
					return { data: null, loading: "idle", error: null };
				default:
					throw new Error("Unhandled action type");
			}
		},
		{
			data: null,
			loading: "idle",
			error: null,
		}
	);

	const isFetching = useRef(false);

	const fetchData = useCallback(
		async (data?: any) => {
			if (isFetching.current) return;
			isFetching.current = true;
			dispatch({ type: "FETCH_INIT" });

			try {
				const BearerToken = enableToken
					? await getSecureStorage<Session["user"]>(configs.sessionName)
					: null;

				if (enableToken && !BearerToken?.accessToken) {
					throw new Error("No access token found");
				}

				const response = await fetch(url, {
					method,
					credentials: withCredentials ? "include" : "same-origin",
					headers: {
						"Content-Type": "application/json",
						Authorization: enableToken ? `Bearer ${BearerToken?.accessToken}` : "",
					},
					cache: "no-cache",
					redirect: "follow",
					body: method === "POST" && data ? JSON.stringify(data) : null,
					...options,
				});

				const responseBody = await response.json();

				if (!response.ok) {
					if (errorCallBack) errorCallBack([responseBody]);
					throw new Error(responseBody.message || "An error occurred");
				}

				dispatch({ type: "FETCH_SUCCESS", payload: responseBody });
				onChangeData(responseBody);
			} catch (err: any) {
				dispatch({ type: "FETCH_FAILURE", error: err.message || "An error occurred" });
			} finally {
				isFetching.current = false;
			}
		},
		[url, withCredentials, enableToken, method, options, errorCallBack, onChangeData]
	);

	const reloadData = useCallback(() => {
		dispatch({ type: "RESET" });
		fetchData();
	}, [fetchData]);

	const resetData = useCallback(() => {
		dispatch({ type: "RESET" });
	}, []);

	useEffect(() => {
		if (initialFetch) fetchData();
	}, [initialFetch, fetchData]);

	return {
		data: state.data,
		loading: state.loading,
		error: state.error,
		fetch: fetchData,
		reset: resetData,
		reload: reloadData,
	};
};
