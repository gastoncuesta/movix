import {useCallback, useEffect, useState} from "react";
import {Alert} from "react-native";

interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
    fn: (params: P) => Promise<T>;
    params?: P;
    skip?: boolean;
}

interface UseAppwriteReturn<T, P> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: (newParams?: P) => Promise<void>;
}

export const useAppWrite = <T, P extends Record<string, string | number>>({
                                                                              fn, //The asynchronous function to fetch data
                                                                              params = {} as P, // Default fetch parameters (empty)
                                                                              skip = false
                                                                          }: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(!skip);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(
        async (fetchParams: P) => {
            setLoading(true);
            setError(null);

            try {
                const result = await fn(fetchParams);
                setData(result);
            } catch (err: unknown) {
                const errMsg = err instanceof Error ? err.message : "An unknown error occurred";
                setError(errMsg)
                Alert.alert("Error", errMsg);
            } finally {
                setLoading(false);
            }
        }, [fn]
    );

    useEffect(() => {
        if (!skip) {
            fetchData(params)
        }
    }, [])

    const refetch = async (newParams?: P) => await fetchData(newParams ?? params)

    return {data, loading, error, refetch}
}