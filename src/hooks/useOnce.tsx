import { useCallback, useEffect, useRef, useState } from "react";

function useOnce(effect: () => void, trigger?: any) {
  const hasRun = useRef(false);
  const [shouldRun, setShouldRun] = useState(false);

  // This effect runs on the initial mount and when the trigger changes
  useEffect(() => {
    if (shouldRun || !hasRun.current) {
      effect();
      hasRun.current = true;
      setShouldRun(false);
    }
  }, [effect, shouldRun, trigger]);

  // This function can be used to manually re-trigger the effect
  return useCallback(() => {
    hasRun.current = false; // Reset the flag to allow re-execution
    setShouldRun(true); // Set the state to trigger the effect
  }, []);
}

export default useOnce;
