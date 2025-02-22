import { useCallback, useEffect, useReducer, useRef } from 'react';
import { configs } from "@/configs";
import { Session, loadingType } from '@/types';
import { getSecureStorage } from './SecureStore';
const _url = `${configs.serverApi.baseUrl}/graphql`.replace("/v1", "");

// ================================================= Object Query ===========================================================================================================================================

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
    loading: loadingType
    error: string | null;
}

export const useGQObject = <T>({
    query,
    variables,
    url = _url,
    withCredentials = true,
    errorCallBack,
    initialFetch = true
}: {
    query: string;
    variables: any;
    url?: string;
    withCredentials?: boolean;
    errorCallBack?: (error: GraphqlError[]) => void;
    initialFetch?: boolean;
}): {
    data: T | null;
    loading: loadingType;
    error: string | null;
    fetch: () => void;
    reset: () => void;
    reload: () => void;
} => {
    const [state, dispatch] = useReducer((state: State<T>, action: Action<T>): State<T> => {
        switch (action.type) {
            case 'FETCH_INIT':
                return { ...state, loading: "pending", error: null };
            case 'FETCH_SUCCESS':
                return { ...state, loading: "normal", data: action.payload };
            case 'FETCH_FAILURE':
                return { ...state, loading: "normal", error: action.error };
            case 'RESET':
                return { ...state, loading: "normal", data: null, error: null };
            default:
                throw new Error();
        }
    }, {
        data: null,
        loading: "idle",
        error: null,
    } as State<T>);
    const isFetching = useRef(false);

    const fetchData = useCallback(async () => {
        if (isFetching.current) return;
        isFetching.current = true;
        dispatch({ type: 'FETCH_INIT' });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        try {
            const BearerToken = await getSecureStorage<Session["user"]>(configs.sessionName);
            if (!BearerToken?.accessToken) {
                console.error("Error retrieving token from SecureStorage");
                return;
            };

            const response = await fetch(url, {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${BearerToken.accessToken}`,
                },
                body: JSON.stringify({
                    query,
                    variables: {
                        graphQlPageQuery: {
                            ...variables,
                        },
                    },
                }),
                cache: 'no-cache',
            });

            if (!response.ok) {
                const responseBody: GraphqlResponse<any> = await response.json();
                console.error(responseBody);
                throw new Error('Network response was not ok');
            };

            const responseBody: GraphqlResponse<any> = await response.json();

            if (responseBody.errors) {
                const errors = responseBody.errors || [{ message: 'Unknown error' }];
                if (errorCallBack) {
                    errorCallBack(errors);
                }
                throw new Error(errors[0]?.message || "GraphQL Error");
            };
            dispatch({ type: 'FETCH_SUCCESS', payload: responseBody.data[Object.keys(responseBody.data)[0]] });
        } catch (err: any) {
            dispatch({ type: 'FETCH_FAILURE', error: err.message || "An error occurred" });
        } finally {
            isFetching.current = false;
        }
    }, [query, url, variables, withCredentials]);

    const reloadData = useCallback(() => {
        isFetching.current = false;
        dispatch({ type: "RESET" });
        fetchData();
    }, []);

    const resetData = useCallback(() => {
        isFetching.current = false;
        dispatch({ type: "RESET" });
    }, []);

    useEffect(() => {
        if (!initialFetch) return;
        fetchData();
    }, [initialFetch]);

    return {
        data: state.data,
        loading: state.loading,
        error: state.error,
        fetch: fetchData,
        reset: resetData,
        reload: reloadData,
    };
};

// ================================================= Array Query ===========================================================================================================================================

// Define the state structure
interface Array_State<T> {
    data: T[];
    loading: loadingType
    error: string | null;
}

// Define actions
type Array_Action<T> =
    | { type: "FETCH_INIT" }
    | { type: "FETCH_SUCCESS"; payload: T[] }
    | { type: "ADD_ITEM_PUSH"; payload: T }
    | { type: "ADD_ITEM_UNSHIFT"; payload: T }
    | { type: "FETCH_FAILURE"; error: string }
    | { type: "RESET" };

export const useGQArray = <T>({
    query,
    variables,
    url = _url,
    withCredentials = true,
    errorCallBack,
    initialFetch = true,
    defaultValue = null,
    onDataChange,
    onError
}: {
    query: string;
    variables?: { limit?: number; id?: string; offset?: number };
    url?: string;
    withCredentials?: boolean;
    errorCallBack?: (error: GraphqlError[]) => void;
    requestCount?: number;
    initialFetch?: boolean;
    defaultValue?: T | null
    onDataChange?: (data: T) => void
    onError?: (data: any) => void
}) => {
    const [state, dispatch] = useReducer((state: Array_State<T>, action: Array_Action<T>): Array_State<T> => {
        switch (action.type) {
            case "FETCH_INIT":
                return { ...state, loading: "pending", error: null };
            case "FETCH_SUCCESS":
                if (action.payload.length <= 0) {
                    return { ...state, loading: "normal" };
                }
                return {
                    ...state,
                    loading: "normal",
                    data: state.data.concat(action.payload),
                };
            case "FETCH_FAILURE":
                return { ...state, loading: "normal", error: action.error };
            case "ADD_ITEM_PUSH":
                return { ...state, data: [...state.data, action.payload] };
            case "ADD_ITEM_UNSHIFT":
                return { ...state, data: [action.payload, ...state.data] };
            case "RESET":
                return { ...state, loading: "idle", data: [], error: null };
            default:
                throw new Error("Unknown action type");
        }
    }, {
        data: [],
        loading: "idle",
        error: null,
    });
    const totalItemCount = useRef(state.data.length);
    const stopFetch = useRef(false); //  Track if there are more data to fetch
    const isFetching = useRef(false); // Track ongoing requests
    const fetchingCount = useRef(0); // count of requests made
    const limit = variables?.limit || 16;
    // Fetch Data
    const fetchData = useCallback(async () => {
        try {
            if (stopFetch.current || isFetching.current) return;
            isFetching.current = true;
            dispatch({ type: "FETCH_INIT" });
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const BearerToken = await getSecureStorage<Session["user"]>(configs.sessionName);
            if (!BearerToken?.accessToken) throw new Error("No token available");

            const response = await fetch(url, {
                method: "POST",
                credentials: withCredentials ? "include" : "omit",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${BearerToken.accessToken}`,
                },
                body: JSON.stringify({
                    query,
                    variables: {
                        graphQlPageQuery: {
                            id: variables?.id ?? null,
                            limit: limit,
                            offset: totalItemCount.current,
                        },
                    },
                }),
                cache: "no-cache",
            });

            const responseBody: GraphqlResponse<any> = await response.json();

            if (!response.ok || responseBody.errors) {
                const errorMsg = responseBody.errors?.[0]?.message || "Unknown GraphQL error";
                if (errorCallBack) errorCallBack(responseBody.errors || []);
                throw new Error(errorMsg);
            }
            const data = responseBody.data[Object.keys(responseBody.data)[0]];
            if (data.length < limit) {
                stopFetch.current = true;
            }
            fetchingCount.current++;
            onDataChange?.(data)
            dispatch({ type: "FETCH_SUCCESS", payload: data });
        } catch (err: any) {
            stopFetch.current = true
            fetchingCount.current++;
            onError?.(err)
            dispatch({ type: "FETCH_FAILURE", error: err.message || "An error occurred" });
            console.error("Internal Error", err)
        } finally {
            isFetching.current = false;
        }
    }, [query, url, variables, withCredentials]);

    // Reset and fetch fresh data
    const reloadData = useCallback(() => {
        stopFetch.current = false;
        totalItemCount.current = 0;
        dispatch({ type: "RESET" });
        fetchData();
    }, [fetchData]);

    // Load more data (pagination)
    const loadMoreData = useCallback(() => {
        if (stopFetch.current || isFetching.current) return;
        // Update the total item count before fetching
        totalItemCount.current = state.data.length;
        fetchData();
    }, [fetchData, state.data.length]);

    const addItemPush = useCallback((item: T) => {
        dispatch({ type: "ADD_ITEM_PUSH", payload: item });
    }, [state.data.length])

    const addItemUnshift = useCallback((item: T) => {
        dispatch({ type: "ADD_ITEM_UNSHIFT", payload: item });
    }, [state.data.length])

    // Initial data load
    useEffect(() => {
        if (!initialFetch) return;
        fetchData();
    }, [initialFetch]);

    return {
        data: state.data,
        loading: state.loading,
        error: state.error,
        fetch: fetchData,
        reload: reloadData,
        loadMoreData,
        requestCount: fetchingCount.current,
        totalItemCount,
        isFetching,
        addItemPush,
        addItemUnshift
    };
};

// ================================================= Mutation ===========================================================================================================================================
// Define action types for the reducer
type MutationAction<T> =
    | { type: 'MUTATION_INIT' }
    | { type: 'MUTATION_SUCCESS'; payload: T }
    | { type: 'MUTATION_FAILURE'; error: string }
    | { type: 'RESET' };

// Define the state structure
interface MutationState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}
export const useGQMutation = <T>({
    mutation,
    url = _url,
    withCredentials = true,
    errorCallBack,
    defaultValue = null,
    onDataChange,
    onError
}: {
    mutation: string;
    url?: string;
    withCredentials?: boolean;
    errorCallBack?: (error: GraphqlError[]) => void;
    defaultValue?: T | null
    onDataChange?: (data: T) => void
    onError?: (data: any) => void
}) => {
    const [state, dispatch] = useReducer((state: MutationState<T>, action: MutationAction<T>): MutationState<T> => {
        switch (action.type) {
            case 'MUTATION_INIT':
                return { ...state, loading: true, error: null };
            case 'MUTATION_SUCCESS':
                return { ...state, loading: false, data: action.payload, error: null };
            case 'MUTATION_FAILURE':
                return { ...state, loading: false, error: action.error };
            case 'RESET':
                return { data: null, loading: false, error: null };
            default:
                throw new Error();
        }
    }, {
        data: defaultValue,
        loading: false,
        error: null,
    });

    const isMutating = useRef(false);

    const executeMutation = useCallback(async (variables: any) => {
        if (isMutating.current) return;
        isMutating.current = true;
        dispatch({ type: 'MUTATION_INIT' });

        try {
            const BearerToken = await getSecureStorage<Session["user"]>(configs.sessionName);
            if (!BearerToken?.accessToken) {
                console.error("Error retrieving token from SecureStorage");
                return;
            }

            const response = await fetch(url, {
                method: 'POST',
                credentials: withCredentials ? 'include' : 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${BearerToken.accessToken}`,
                },
                body: JSON.stringify({
                    query: mutation,
                    variables,
                }),
                cache: 'no-cache',
            });

            const responseBody: GraphqlResponse<any> = await response.json();

            if (responseBody.errors) {
                const errors = responseBody.errors || [{ message: 'Unknown error' }];
                if (errorCallBack) {
                    errorCallBack(errors);
                }
                onError?.("GraphQL Error")
                throw new Error(errors[0]?.message || "GraphQL Error");
            }

            dispatch({ type: 'MUTATION_SUCCESS', payload: responseBody.data[Object.keys(responseBody.data)[0]] });
            onDataChange?.(responseBody.data[Object.keys(responseBody.data)[0]])
        } catch (err: any) {
            onError?.(err?.message || "An error occurred")
            dispatch({ type: 'MUTATION_FAILURE', error: err.message || "An error occurred" });
        } finally {
            isMutating.current = false;
        }
    }, [mutation, url, withCredentials]);

    const resetMutation = useCallback(() => {
        isMutating.current = false;
        dispatch({ type: 'RESET' });
    }, []);

    return {
        data: state.data,
        loading: state.loading,
        error: state.error,
        mutate: executeMutation,
        reset: resetMutation,
    };
};