import { useCallback, useReducer, useRef } from 'react';
import { configs } from "@/configs";
import { SecureStorage } from "@/lib/SecureStore";
import { loadingType } from '@/types';

interface GraphqlResponse<T> {
    data: T;
    errors: GraphqlError[];
}

export type GraphqlQueryType = {
    name: string;
    operation: string;
    query: string;
};

export interface GraphqlError {
    message: string;
    locations?: { line: number; column: number }[];
    path?: string[];
    extensions?: any;
}

// Define action types for the reducer
type Action<T> =
    | { type: 'FETCH_INIT' }
    | { type: 'FETCH_SUCCESS'; payload: T }
    | { type: 'FETCH_FAILURE'; error: string }
    | { type: 'RESET' };

// Define the state structure
interface State<T> {
    data: T | null | any;
    loading: loadingType;
    error: string | null;
}

// Create a reducer function
const dataFetchReducer = <T>(state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
        case 'FETCH_INIT':
            return { ...state, loading: "pending", error: null };
        case 'FETCH_SUCCESS':
            return { ...state, loading: "normal", data: action.payload };
        case 'FETCH_FAILURE':
            return { ...state, loading: "normal", error: action.error };
        case 'RESET':
            return { ...state, loading: "idle", data: null, error: null };
        default:
            throw new Error();
    }
};

// Define the initial state
const initialState = {
    data: null,
    loading: "idle",
    error: null,
};

export const useGraphqlQuery = <T>({
    query,
    variables,
    url = `${configs.serverApi.baseUrl}/graphql`.replace("/v1", ""),
    withCredentials = true,
    errorCallBack,
}: {
    query: string;
    variables: any;
    url?: string;
    withCredentials?: boolean;
    errorCallBack?: (error: GraphqlError[]) => void;
}): {
    data: T | null;
    loading: loadingType;
    error: string | null;
    fetch: () => void;
    reset: () => void;
    reload: () => void;
} => {
    const [state, dispatch] = useReducer(dataFetchReducer, initialState as State<T>);

    const getBearerToken = useCallback(async () => {
        try {
            const token = await SecureStorage("get", configs.sessionName);
            return token?.accessToken;
        } catch (err) {
            console.error("Error retrieving token from SecureStorage", err);
            return null;
        }
    }, []);

    const fetchData = useCallback(async () => {
        dispatch({ type: 'FETCH_INIT' });
        try {
            const token = await getBearerToken();
            if (!token) {
                throw new Error("No Bearer Token available");
            }

            const response = await fetch(url, {
                method: 'POST',
                credentials: withCredentials ? "include" : "same-origin",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    query,
                    variables,
                }),
                cache: 'no-cache',
            });

            if (!response.ok) {
                const responseBody: GraphqlResponse<any> = await response.json();
                console.error(responseBody);
                throw new Error('Network response was not ok');
            }

            const responseBody: GraphqlResponse<any> = await response.json();

            if (responseBody.errors) {
                const errors = responseBody.errors || [{ message: 'Unknown error' }];
                if (errorCallBack) {
                    errorCallBack(errors);
                }
                throw new Error(errors[0]?.message || "GraphQL Error");
            }

            dispatch({ type: 'FETCH_SUCCESS', payload: responseBody.data[Object.keys(responseBody.data)[0]] });
        } catch (err: any) {
            dispatch({ type: 'FETCH_FAILURE', error: err.message || "An error occurred" });
        }
    }, [query, url, variables, withCredentials]);

    const reloadData = useCallback(() => {
        dispatch({ type: "RESET" });
        fetchData();
    }, []);

    const resetData = useCallback(() => {
        dispatch({ type: "RESET" });
    }, []);

    return {
        data: state.data,
        loading: state.loading,
        error: state.error,
        fetch: fetchData,
        reset: resetData,
        reload: reloadData,
    };
};
