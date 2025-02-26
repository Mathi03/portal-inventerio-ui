import { useCallback, useEffect, useState } from "react";

export default function useStorage<T = unknown>(
  name: string,
  initVuale: T,
): [T, (value: T) => void, boolean] {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [state, setState] = useState<T>(initVuale);

  const changeState = useCallback(
    (value: T) => {
      setState(value);
      if (value) {
        sessionStorage.setItem(name, JSON.stringify(value));
      } else {
        sessionStorage.removeItem(name);
      }
    },
    [name],
  );

  useEffect(() => {
    const stateDefault = sessionStorage.getItem(name);
    if (stateDefault) {
      setState(JSON.parse(stateDefault));
    }
    setTimeout(() => setIsLoading(false), 1000);
  }, [name]);

  return [state, changeState, isLoading];
}
