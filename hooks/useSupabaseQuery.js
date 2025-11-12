import { useState, useEffect, useCallback, useRef } from 'react';
import { executeQuery } from '@/lib/supabaseClient';

/**
 * Hook personalizado para queries de Supabase con:
 * - Auto-retry en caso de error
 * - Timeout configurable
 * - Cancelación automática
 * - Cache opcional
 * - Loading states
 */
export function useSupabaseQuery(queryFn, options = {}) {
  const {
    enabled = true,
    retry = 3,
    timeout = 10000,
    cacheTime = 0,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const isMountedRef = useRef(true);
  const cacheRef = useRef({ data: null, timestamp: 0 });

  const execute = useCallback(async () => {
    // Verificar cache
    if (cacheTime > 0) {
      const now = Date.now();
      const cacheAge = now - cacheRef.current.timestamp;
      if (cacheAge < cacheTime && cacheRef.current.data) {
        setData(cacheRef.current.data);
        setLoading(false);
        return cacheRef.current.data;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await executeQuery(queryFn, {
        maxRetries: retry,
        timeout,
        onRetry: (attempt, err) => {
          console.log(`Query retry attempt ${attempt}:`, err.message);
        },
      });

      if (!isMountedRef.current) return;

      setData(result.data);
      setError(null);

      // Actualizar cache
      if (cacheTime > 0) {
        cacheRef.current = {
          data: result.data,
          timestamp: Date.now(),
        };
      }

      if (onSuccess) onSuccess(result.data);
      return result.data;
    } catch (err) {
      if (!isMountedRef.current) return;

      console.error('Query error:', err);
      setError(err);
      setData(null);

      if (onError) onError(err);
      throw err;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [queryFn, retry, timeout, cacheTime, onSuccess, onError]);

  useEffect(() => {
    isMountedRef.current = true;

    if (enabled) {
      execute();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [enabled, execute]);

  const refetch = useCallback(() => {
    // Invalidar cache
    cacheRef.current = { data: null, timestamp: 0 };
    return execute();
  }, [execute]);

  const invalidateCache = useCallback(() => {
    cacheRef.current = { data: null, timestamp: 0 };
  }, []);

  return {
    data,
    error,
    loading,
    refetch,
    invalidateCache,
  };
}

/**
 * Hook para mutations (INSERT, UPDATE, DELETE)
 */
export function useSupabaseMutation(mutationFn, options = {}) {
  const {
    onSuccess,
    onError,
    onSettled,
  } = options;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const mutate = useCallback(async (variables) => {
    setLoading(true);
    setError(null);

    try {
      const result = await executeQuery(
        () => mutationFn(variables),
        {
          maxRetries: 1, // Solo 1 retry para mutations
          timeout: 15000, // Más tiempo para mutations
        }
      );

      setData(result.data);
      setError(null);

      if (onSuccess) onSuccess(result.data, variables);
      return result.data;
    } catch (err) {
      console.error('Mutation error:', err);
      setError(err);

      if (onError) onError(err, variables);
      throw err;
    } finally {
      setLoading(false);
      if (onSettled) onSettled();
    }
  }, [mutationFn, onSuccess, onError, onSettled]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    error,
    loading,
    mutate,
    reset,
  };
}

/**
 * Hook para paginación optimizada
 */
export function useSupabasePagination(queryFn, options = {}) {
  const {
    pageSize = 10,
    enabled = true,
  } = options;

  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const fetchPage = useCallback(async (pageNumber) => {
    setLoading(true);
    setError(null);

    try {
      const from = (pageNumber - 1) * pageSize;
      const to = from + pageSize - 1;

      const result = await executeQuery(
        () => queryFn(from, to),
        {
          maxRetries: 3,
          timeout: 10000,
        }
      );

      setData(result.data || []);
      setTotal(result.count || 0);
      setError(null);
    } catch (err) {
      console.error('Pagination error:', err);
      setError(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [queryFn, pageSize]);

  useEffect(() => {
    if (enabled) {
      fetchPage(page);
    }
  }, [page, enabled, fetchPage]);

  const nextPage = useCallback(() => {
    const maxPage = Math.ceil(total / pageSize);
    if (page < maxPage) {
      setPage(p => p + 1);
    }
  }, [page, total, pageSize]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(p => p - 1);
    }
  }, [page]);

  const goToPage = useCallback((pageNumber) => {
    const maxPage = Math.ceil(total / pageSize);
    if (pageNumber >= 1 && pageNumber <= maxPage) {
      setPage(pageNumber);
    }
  }, [total, pageSize]);

  const refetch = useCallback(() => {
    return fetchPage(page);
  }, [page, fetchPage]);

  return {
    data,
    total,
    loading,
    error,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    nextPage,
    prevPage,
    goToPage,
    refetch,
  };
}
