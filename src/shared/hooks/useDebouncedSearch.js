import { useEffect, useMemo, useState } from 'react';

export function useDebouncedSearch(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  const hasQuery = useMemo(() => (debounced || '').trim().length > 0, [debounced]);
  return { debounced, hasQuery };
}



